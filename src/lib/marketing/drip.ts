import { getSupabaseAdmin } from "@/lib/supabase-server";
import { sendSMS } from "./twilio";
import { sendEmail } from "./sendgrid";
import { getDripSMS, getDripEmail, buildDripEmailHTML } from "./templates";
import type { DripCampaign, DripMessage, Lead, SendResult } from "./types";

/**
 * For a given campaign + step, resolve which messages array to use
 * and return the SMS and email messages at that step index.
 */
function resolveStepMessages(
  campaign: DripCampaign,
  step: number
): { smsMsg: DripMessage | null; emailMsg: DripMessage | null; maxSteps: number } {
  if (campaign.channel === "both") {
    const smsList = (campaign.sms_messages ?? []) as readonly DripMessage[];
    const emailList = (campaign.email_messages ?? []) as readonly DripMessage[];
    return {
      smsMsg: smsList[step] ?? null,
      emailMsg: emailList[step] ?? null,
      maxSteps: Math.max(smsList.length, emailList.length),
    };
  }

  const messages = campaign.messages as readonly DripMessage[];
  const msg = messages[step] ?? null;
  return {
    smsMsg: campaign.channel === "sms" ? msg : null,
    emailMsg: campaign.channel === "email" ? msg : null,
    maxSteps: messages.length,
  };
}

/** Get the delay for the first step to calculate initial next_send_at */
function getFirstStepDelay(campaign: DripCampaign): number {
  if (campaign.channel === "both") {
    const smsList = (campaign.sms_messages ?? []) as readonly DripMessage[];
    const emailList = (campaign.email_messages ?? []) as readonly DripMessage[];
    const firstSms = smsList[0];
    const firstEmail = emailList[0];
    // Use the smaller delay so we don't miss either
    const smsDelay = firstSms?.delay_days ?? 0;
    const emailDelay = firstEmail?.delay_days ?? 0;
    return Math.min(smsDelay, emailDelay);
  }
  const messages = campaign.messages as readonly DripMessage[];
  return messages[0]?.delay_days ?? 0;
}

/** Get the delay for a given step (for advancing to next) */
function getStepDelay(campaign: DripCampaign, step: number): number {
  if (campaign.channel === "both") {
    const smsList = (campaign.sms_messages ?? []) as readonly DripMessage[];
    const emailList = (campaign.email_messages ?? []) as readonly DripMessage[];
    const smsDelay = smsList[step]?.delay_days ?? 1;
    const emailDelay = emailList[step]?.delay_days ?? 1;
    return Math.min(smsDelay, emailDelay);
  }
  const messages = campaign.messages as readonly DripMessage[];
  return messages[step]?.delay_days ?? 1;
}

export async function getActiveCampaigns(): Promise<readonly DripCampaign[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("drip_campaigns")
    .select("*")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }

  return data as DripCampaign[];
}

export async function enrollLeadInCampaigns(lead: Lead): Promise<void> {
  const campaigns = await getActiveCampaigns();
  const supabase = getSupabaseAdmin();

  const enrollments = campaigns
    .filter((campaign) => {
      if (campaign.channel === "sms" && !lead.sms_consent) return false;
      if (campaign.channel === "email" && !lead.email_consent) return false;
      // "both" campaigns: need at least one consent
      if (campaign.channel === "both" && !lead.sms_consent && !lead.email_consent) return false;
      return true;
    })
    .map((campaign) => {
      const delayDays = getFirstStepDelay(campaign);
      const delayMs = delayDays * 24 * 60 * 60 * 1000;

      return {
        lead_id: lead.id,
        campaign_id: campaign.id,
        current_step: 0,
        next_send_at: new Date(Date.now() + delayMs).toISOString(),
        status: "active" as const,
      };
    });

  if (enrollments.length === 0) return;

  const { error } = await supabase.from("lead_drip_state").insert(enrollments);

  if (error) {
    throw new Error(`Failed to enroll lead in campaigns: ${error.message}`);
  }
}

export async function processNextDripMessages(): Promise<SendResult> {
  const supabase = getSupabaseAdmin();
  let sent = 0;
  let errors = 0;

  // Fetch drip states that are due
  const { data: dueStates, error: fetchError } = await supabase
    .from("lead_drip_state")
    .select("*, leads(*), drip_campaigns(*)")
    .eq("status", "active")
    .lte("next_send_at", new Date().toISOString());

  if (fetchError) {
    throw new Error(`Failed to fetch due drip states: ${fetchError.message}`);
  }

  if (!dueStates || dueStates.length === 0) {
    return { sent: 0, errors: 0 };
  }

  for (const state of dueStates) {
    const lead = state.leads as unknown as Lead;
    const campaign = state.drip_campaigns as unknown as DripCampaign;

    if (!lead) {
      errors++;
      continue;
    }

    const { smsMsg, emailMsg, maxSteps } = resolveStepMessages(campaign, state.current_step);

    try {
      // Send SMS if available and consented
      if (smsMsg && lead.sms_consent && (campaign.channel === "sms" || campaign.channel === "both")) {
        const body = smsMsg.body || getDripSMS(state.current_step, lead);
        await sendSMS(lead.phone, body);
        sent++;
      }

      // Send Email if available and consented
      if (emailMsg && lead.email_consent && (campaign.channel === "email" || campaign.channel === "both")) {
        // If body comes from DB, wrap it in the branded HTML template
        if (emailMsg.body) {
          const subject = emailMsg.subject || `Message from TheLevelTeam`;
          const html = buildDripEmailHTML(emailMsg.subject || "", emailMsg.body, lead);
          await sendEmail(lead.email, subject, html);
        } else {
          // Fallback to hardcoded template
          const emailContent = getDripEmail(state.current_step, lead);
          const subject = emailMsg.subject || emailContent.subject;
          await sendEmail(lead.email, subject, emailContent.html);
        }
        sent++;
      }
    } catch (err) {
      console.error(`Drip send failed for lead ${lead.id}, campaign ${campaign.id}:`, err);
      errors++;
      continue;
    }

    // Advance to next step
    const nextStep = state.current_step + 1;
    const isComplete = nextStep >= maxSteps;

    if (isComplete) {
      await supabase
        .from("lead_drip_state")
        .update({
          status: "completed",
          current_step: nextStep,
          last_sent_at: new Date().toISOString(),
          next_send_at: null,
        })
        .eq("id", state.id);
    } else {
      const delayDays = getStepDelay(campaign, nextStep);
      const delayMs = delayDays * 24 * 60 * 60 * 1000;

      await supabase
        .from("lead_drip_state")
        .update({
          current_step: nextStep,
          last_sent_at: new Date().toISOString(),
          next_send_at: new Date(Date.now() + delayMs).toISOString(),
        })
        .eq("id", state.id);
    }
  }

  return { sent, errors };
}

export async function pauseCampaignsForLead(
  leadId: string,
  channel: "sms" | "email"
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Get campaigns matching the channel (including "both")
  const campaigns = await getActiveCampaigns();
  const channelCampaignIds = campaigns
    .filter((c) => c.channel === channel || c.channel === "both")
    .map((c) => c.id);

  if (channelCampaignIds.length === 0) return;

  const { error } = await supabase
    .from("lead_drip_state")
    .update({ status: "unsubscribed" })
    .eq("lead_id", leadId)
    .in("campaign_id", channelCampaignIds)
    .eq("status", "active");

  if (error) {
    throw new Error(`Failed to pause campaigns: ${error.message}`);
  }
}
