/**
 * Maps between dashboard UI Campaign type and DB DripCampaign type.
 *
 * UI Campaign has: channel ("sms" | "email" | "both"), steps, smsSteps, emailSteps
 * DB DripCampaign has: channel, messages (JSONB), sms_messages (JSONB), email_messages (JSONB)
 */

import type { DripCampaign, DripMessage } from "./types";

/** UI types (duplicated to avoid circular import from dashboard components) */
export interface UICampaign {
  readonly id: string;
  readonly name: string;
  readonly channel: "sms" | "email" | "both";
  readonly steps: readonly UIFlowStep[];
  readonly smsSteps: readonly UIFlowStep[];
  readonly emailSteps: readonly UIFlowStep[];
}

export interface UIFlowStep {
  readonly id: string;
  readonly label: string;
  readonly delay: string;
  readonly description: string;
}

/** Parse "Day 2" → 2, "Immediate" → 0 */
function parseDelayDays(delay: string): number {
  if (delay.toLowerCase() === "immediate") return 0;
  const match = delay.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Convert 0 → "Immediate", 2 → "Day 2" */
function formatDelayDays(days: number): string {
  return days === 0 ? "Immediate" : `Day ${days}`;
}

/** UI FlowStep → DB DripMessage */
function stepToMessage(step: UIFlowStep): DripMessage {
  return {
    delay_days: parseDelayDays(step.delay),
    subject: step.label,
    body: step.description,
  };
}

/** DB DripMessage → UI FlowStep */
function messageToStep(msg: DripMessage): UIFlowStep {
  return {
    id: crypto.randomUUID(),
    label: msg.subject ?? "",
    delay: formatDelayDays(msg.delay_days),
    description: msg.body,
  };
}

/** Convert UI Campaign → DB payload for save */
export function uiCampaignToDb(campaign: UICampaign): {
  name: string;
  channel: string;
  messages: DripMessage[];
  sms_messages: DripMessage[] | null;
  email_messages: DripMessage[] | null;
} {
  if (campaign.channel === "both") {
    return {
      name: campaign.name,
      channel: "both",
      messages: [],
      sms_messages: campaign.smsSteps.map(stepToMessage),
      email_messages: campaign.emailSteps.map(stepToMessage),
    };
  }

  return {
    name: campaign.name,
    channel: campaign.channel,
    messages: campaign.steps.map(stepToMessage),
    sms_messages: null,
    email_messages: null,
  };
}

/** Convert DB DripCampaign → UI Campaign for display */
export function dbCampaignToUi(db: DripCampaign): UICampaign {
  if (db.channel === "both") {
    return {
      id: db.id,
      name: db.name,
      channel: "both",
      steps: [],
      smsSteps: (db.sms_messages ?? []).map(messageToStep),
      emailSteps: (db.email_messages ?? []).map(messageToStep),
    };
  }

  return {
    id: db.id,
    name: db.name,
    channel: db.channel,
    steps: (db.messages ?? []).map(messageToStep),
    smsSteps: [],
    emailSteps: [],
  };
}
