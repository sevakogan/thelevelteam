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
  return { id: crypto.randomUUID(), name, channel, steps };
}
