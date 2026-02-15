export interface Lead {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly message: string | null;
  readonly project_interest: string | null;
  readonly source: string;
  readonly status: LeadStatus;
  readonly sms_consent: boolean;
  readonly email_consent: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export type LeadStatus = "new" | "contacted" | "converted" | "unsubscribed";

export interface LeadInput {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly message?: string;
  readonly projectInterest?: string;
  readonly smsConsent: boolean;
  readonly emailConsent: boolean;
  readonly source?: string;
}

export interface DripMessage {
  readonly delay_days: number;
  readonly subject?: string;
  readonly body: string;
}

export interface DripCampaign {
  readonly id: string;
  readonly name: string;
  readonly channel: "sms" | "email";
  readonly messages: readonly DripMessage[];
  readonly is_active: boolean;
  readonly created_at: string;
}

export type DripStateStatus = "active" | "completed" | "paused" | "unsubscribed";

export interface LeadDripState {
  readonly id: string;
  readonly lead_id: string;
  readonly campaign_id: string;
  readonly current_step: number;
  readonly next_send_at: string | null;
  readonly status: DripStateStatus;
  readonly last_sent_at: string | null;
  readonly created_at: string;
}

export interface SendResult {
  readonly sent: number;
  readonly errors: number;
}
