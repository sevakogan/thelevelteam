import type { LeadStatus } from "@/lib/marketing/types";

export type AutomationTrigger =
  | "enters_pipeline"
  | "enters_stage"
  | "leaves_stage"
  | "status_changed";

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  enters_pipeline: "Lead enters pipeline",
  enters_stage: "Lead enters stage",
  leaves_stage: "Lead leaves stage",
  status_changed: "Status changes",
};

export type AutomationActionType = "send_campaign" | "change_status" | "send_notification" | "wait";

export interface AutomationAction {
  readonly id: string;
  readonly type: AutomationActionType;
  readonly campaignId?: string;
  readonly status?: LeadStatus;
  readonly message?: string;
  readonly days?: number;
}

export const ACTION_LABELS: Record<AutomationActionType, string> = {
  send_campaign: "Send campaign",
  change_status: "Change status",
  send_notification: "Send notification",
  wait: "Wait (days)",
};

export interface AutomationRule {
  readonly id: string;
  readonly name: string;
  readonly pipelineId: string;
  readonly trigger: AutomationTrigger;
  readonly triggerStage?: string;
  readonly actions: readonly AutomationAction[];
  readonly isActive: boolean;
  readonly createdAt: string;
}

export function createAutomationRule(
  name: string,
  pipelineId: string,
  trigger: AutomationTrigger
): AutomationRule {
  return {
    id: crypto.randomUUID(),
    name,
    pipelineId,
    trigger,
    actions: [],
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

export function createAutomationAction(type: AutomationActionType): AutomationAction {
  return {
    id: crypto.randomUUID(),
    type,
    ...(type === "wait" ? { days: 1 } : {}),
    ...(type === "send_notification" ? { message: "" } : {}),
  };
}
