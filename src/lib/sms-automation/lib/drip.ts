import { db } from '../db';
import {
  dripCampaigns,
  leadDripState,
  leads,
  DripCampaign,
  Lead,
} from '../db/schema';
import { eq, and, isNull, lte, desc, inArray } from 'drizzle-orm';
import { sendSMS } from '../integrations/twilio';
import { sendEmail } from '../integrations/sendgrid';
import { getDripSMS, getDripEmail } from './templates';
import { notifySlack, formatDripEventSlack } from '../integrations/slack';

/**
 * Get all active drip campaigns
 */
export async function getActiveCampaigns(): Promise<DripCampaign[]> {
  return db
    .select()
    .from(dripCampaigns)
    .where(eq(dripCampaigns.isActive, true));
}

/**
 * Get a campaign by ID
 */
export async function getCampaignById(id: string): Promise<DripCampaign | null> {
  const [campaign] = await db
    .select()
    .from(dripCampaigns)
    .where(eq(dripCampaigns.id, id));

  return campaign || null;
}

/**
 * Create a new drip campaign
 */
export async function createDripCampaign(
  data: Omit<DripCampaign, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DripCampaign> {
  const [campaign] = await db
    .insert(dripCampaigns)
    .values(data)
    .returning();

  if (!campaign) {
    throw new Error('Failed to create campaign');
  }

  return campaign;
}

/**
 * Update drip campaign
 */
export async function updateDripCampaign(
  id: string,
  data: Partial<DripCampaign>
): Promise<DripCampaign> {
  const [campaign] = await db
    .update(dripCampaigns)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(dripCampaigns.id, id))
    .returning();

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  return campaign;
}

/**
 * Toggle campaign active status
 */
export async function toggleCampaignActive(id: string): Promise<DripCampaign> {
  const campaign = await getCampaignById(id);
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  return updateDripCampaign(id, { isActive: !campaign.isActive });
}

/**
 * Enroll a lead in active campaigns
 */
export async function enrollLeadInCampaigns(lead: Lead): Promise<void> {
  const campaigns = await getActiveCampaigns();

  for (const campaign of campaigns) {
    // Check if already enrolled
    const [existing] = await db
      .select()
      .from(leadDripState)
      .where(
        and(
          eq(leadDripState.leadId, lead.id),
          eq(leadDripState.campaignId, campaign.id)
        )
      );

    if (!existing) {
      await db.insert(leadDripState).values({
        leadId: lead.id,
        campaignId: campaign.id,
        currentStep: 0,
        status: 'active',
        nextSendAt: new Date(), // Send immediately
      });

      await notifySlack(
        formatDripEventSlack({
          type: 'enrolled',
          leadName: lead.name,
          campaignName: campaign.name,
        })
      );
    }
  }
}

/**
 * Get active drip states for a lead
 */
export async function getActiveLeadDripStates(leadId: string) {
  return db
    .select()
    .from(leadDripState)
    .where(
      and(
        eq(leadDripState.leadId, leadId),
        eq(leadDripState.status, 'active')
      )
    );
}

/**
 * Get campaign names for a lead
 */
export async function getCampaignNamesForLead(leadId: string): Promise<string[]> {
  const states = await db
    .select({ campaignId: leadDripState.campaignId })
    .from(leadDripState)
    .where(eq(leadDripState.leadId, leadId));

  const campaignIds = states.map((s) => s.campaignId);
  if (campaignIds.length === 0) return [];

  const campaigns = await db
    .select({ name: dripCampaigns.name })
    .from(dripCampaigns)
    .where(inArray(dripCampaigns.id, campaignIds));

  return campaigns.map((c) => c.name);
}

/**
 * Pause campaigns for a lead on a specific channel
 */
export async function pauseCampaignsForLead(
  leadId: string,
  channel?: 'sms' | 'email'
): Promise<void> {
  const states = await db
    .select()
    .from(leadDripState)
    .where(eq(leadDripState.leadId, leadId));

  for (const state of states) {
    if (channel) {
      const campaign = await getCampaignById(state.campaignId);
      if (campaign && (campaign.channel === channel || campaign.channel === 'both')) {
        await db
          .update(leadDripState)
          .set({ status: 'paused' })
          .where(eq(leadDripState.id, state.id));
      }
    } else {
      await db
        .update(leadDripState)
        .set({ status: 'paused' })
        .where(eq(leadDripState.id, state.id));
    }
  }
}

/**
 * Process next drip messages - main cron processor
 * This should be called periodically (e.g., every 5 minutes)
 */
export async function processNextDripMessages(): Promise<{
  processed: number;
  errors: Array<{ id: string; error: string }>;
}> {
  const errors: Array<{ id: string; error: string }> = [];
  let processed = 0;

  // Get all drip states that need to be processed
  const pendingStates = await db
    .select()
    .from(leadDripState)
    .innerJoin(
      dripCampaigns,
      eq(leadDripState.campaignId, dripCampaigns.id)
    )
    .innerJoin(leads, eq(leadDripState.leadId, leads.id))
    .where(
      and(
        eq(leadDripState.status, 'active'),
        lte(leadDripState.nextSendAt, new Date())
      )
    )
    .orderBy(leadDripState.nextSendAt);

  for (const item of pendingStates) {
    const state = item.lead_drip_state;
    const campaign = item.drip_campaigns;
    const lead = item.leads;

    try {
      // Get messages for this step
      const messages = (campaign.messages as any) || [];
      const currentMessage = messages[state.currentStep];

      if (!currentMessage) {
        // Campaign completed
        await db
          .update(leadDripState)
          .set({ status: 'completed', updatedAt: new Date() })
          .where(eq(leadDripState.id, state.id));

        await notifySlack(
          formatDripEventSlack({
            type: 'completed',
            leadName: lead.name,
            campaignName: campaign.name,
          })
        );

        processed++;
        continue;
      }

      // Send SMS if applicable
      if (
        campaign.channel === 'sms' ||
        campaign.channel === 'both'
      ) {
        if (lead.smsConsent && lead.status !== 'unsubscribed') {
          try {
            const messageBody = getDripSMS(
              state.currentStep,
              lead,
              currentMessage.body
            );
            await sendSMS({ to: lead.phone, body: messageBody });

            await notifySlack(
              formatDripEventSlack({
                type: 'sent',
                leadName: lead.name,
                campaignName: campaign.name,
                stepNumber: state.currentStep + 1,
              })
            );
          } catch (error) {
            console.error('Failed to send drip SMS:', error);
            errors.push({
              id: state.id,
              error: `SMS send failed: ${error instanceof Error ? error.message : String(error)}`,
            });
          }
        }
      }

      // Send email if applicable
      if (
        campaign.channel === 'email' ||
        campaign.channel === 'both'
      ) {
        if (lead.emailConsent && lead.status !== 'unsubscribed') {
          try {
            const email = getDripEmail(state.currentStep, lead);
            await sendEmail({
              to: lead.email,
              subject: email.subject,
              html: email.html,
            });

            await notifySlack(
              formatDripEventSlack({
                type: 'sent',
                leadName: lead.name,
                campaignName: campaign.name,
                stepNumber: state.currentStep + 1,
              })
            );
          } catch (error) {
            console.error('Failed to send drip email:', error);
            errors.push({
              id: state.id,
              error: `Email send failed: ${error instanceof Error ? error.message : String(error)}`,
            });
          }
        }
      }

      // Calculate next send time
      const nextDelay = (currentMessage.delayDays || 1) * 24 * 60 * 60 * 1000;
      const nextSendAt = new Date(Date.now() + nextDelay);

      // Update state
      await db
        .update(leadDripState)
        .set({
          currentStep: state.currentStep + 1,
          nextSendAt,
          lastSentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leadDripState.id, state.id));

      processed++;
    } catch (error) {
      console.error('Error processing drip state:', error);
      errors.push({
        id: state.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { processed, errors };
}

/**
 * Get all drip campaigns
 */
export async function getAllDripCampaigns(): Promise<DripCampaign[]> {
  return db.select().from(dripCampaigns).orderBy(desc(dripCampaigns.createdAt));
}
