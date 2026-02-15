export type ChannelType = "sms" | "email" | "both";

export interface FlowStep {
  readonly id: string;
  readonly label: string;
  readonly delay: string;
  readonly description: string;
}

export interface Campaign {
  readonly id: string;
  readonly name: string;
  readonly channel: ChannelType;
  readonly steps: readonly FlowStep[];
  readonly smsSteps: readonly FlowStep[];
  readonly emailSteps: readonly FlowStep[];
}

export function createStep(
  label: string,
  delay: string,
  description: string
): FlowStep {
  return { id: crypto.randomUUID(), label, delay, description };
}

export function createCampaign(
  name: string,
  channel: ChannelType,
  steps: readonly FlowStep[]
): Campaign {
  return {
    id: crypto.randomUUID(),
    name,
    channel,
    steps: channel !== "both" ? steps : [],
    smsSteps: channel === "both" ? steps : [],
    emailSteps: channel === "both" ? steps : [],
  };
}

/**
 * When switching channel, migrate steps between single/split layout.
 * - Switching TO "both": copies current steps into both smsSteps and emailSteps
 * - Switching FROM "both": merges smsSteps as the single steps list
 */
export function switchCampaignChannel(
  campaign: Campaign,
  newChannel: ChannelType
): Campaign {
  if (newChannel === campaign.channel) return campaign;

  if (newChannel === "both") {
    // Moving to split: copy single steps into both channels
    return {
      ...campaign,
      channel: newChannel,
      steps: [],
      smsSteps: campaign.steps.length > 0 ? campaign.steps : campaign.smsSteps,
      emailSteps: campaign.steps.length > 0 ? campaign.steps : campaign.emailSteps,
    };
  }

  // Moving to single: take smsSteps or emailSteps as the base
  const baseSteps =
    campaign.channel === "both"
      ? newChannel === "sms"
        ? campaign.smsSteps
        : campaign.emailSteps
      : campaign.steps;

  return {
    ...campaign,
    channel: newChannel,
    steps: baseSteps,
    smsSteps: [],
    emailSteps: [],
  };
}
