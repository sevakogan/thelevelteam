/**
 * Company Billing — Type definitions
 */

export type BillingStatus =
  | "lead"
  | "sent"
  | "viewed"
  | "paid"
  | "in_process"
  | "cancellation_requested"
  | "done"
  | "lost";

export type PaymentStatus = "completed" | "failed" | "refunded" | "pending";

export interface StatusEntry {
  readonly status: string;
  readonly at: string;
  readonly note?: string;
}

export interface BillingCustomer {
  readonly id: string;
  readonly user_id: string;
  readonly company_name: string;
  readonly description: string;
  readonly recurring: boolean;
  readonly amount: number;
  readonly phone: string;
  readonly email: string;
  readonly status: BillingStatus;
  readonly share_token: string | null;
  readonly stripe_customer_id: string | null;
  readonly stripe_subscription_id: string | null;
  readonly contract_enabled: boolean;
  readonly contract_content: string;
  readonly contract_signed: boolean;
  readonly contract_signed_by: string;
  readonly contract_signed_date: string | null;
  readonly job_id: string | null;
  readonly job_name: string | null;
  readonly tags: readonly string[];
  readonly due_date: string | null;
  readonly invoice_number: string | null;
  readonly notes: string;
  readonly payment_count: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly status_history: readonly StatusEntry[];
  readonly cancellation_reason: string | null;
  readonly cancellation_requested_at: string | null;
  readonly cancellation_admin_response: string | null;
  readonly cancellation_discount_type: string | null;
  readonly cancellation_discount_value: number | null;
}

export interface BillingClient {
  readonly id: string;
  readonly user_id: string;
  readonly company_name: string;
  readonly email: string;
  readonly phone: string;
  readonly contract_enabled: boolean;
  readonly contract_content: string;
  readonly contract_signed: boolean;
  readonly contract_signed_by: string;
  readonly contract_signed_date: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateClientInput {
  readonly company_name: string;
  readonly email: string;
  readonly phone: string;
  readonly contract_enabled?: boolean;
  readonly contract_content?: string;
}

export interface BillingJob {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  readonly description: string;
  readonly created_at: string;
}

export interface BillingPayment {
  readonly id: string;
  readonly customer_id: string;
  readonly amount: number;
  readonly method: string;
  readonly stripe_session_id: string | null;
  readonly stripe_payment_intent: string | null;
  readonly status: PaymentStatus;
  readonly note: string;
  readonly paid_at: string;
}

export interface BillingSettings {
  readonly id: string;
  readonly user_id: string;
  readonly company_name: string;
  readonly company_tagline: string;
  readonly company_email: string;
  readonly company_phone: string;
  readonly company_address: string;
  readonly logo_url: string;
  readonly updated_at: string;
}

export interface CreateCustomerInput {
  readonly company_name: string;
  readonly description: string;
  readonly recurring: boolean;
  readonly amount: number;
  readonly phone: string;
  readonly email: string;
  readonly contract_enabled: boolean;
  readonly contract_content: string;
  readonly job_id: string | null;
  readonly tags: readonly string[];
  readonly due_date: string | null;
  readonly notes: string;
  readonly client_id?: string | null;
}

export interface CreateJobInput {
  readonly name: string;
  readonly description: string;
}

export interface UpdateCustomerInput {
  readonly company_name?: string;
  readonly description?: string;
  readonly recurring?: boolean;
  readonly amount?: number;
  readonly phone?: string;
  readonly email?: string;
  readonly status?: BillingStatus;
  readonly contract_enabled?: boolean;
  readonly contract_content?: string;
  readonly contract_signed?: boolean;
  readonly contract_signed_by?: string;
  readonly contract_signed_date?: string;
  readonly stripe_customer_id?: string;
  readonly stripe_subscription_id?: string;
  readonly share_token?: string;
  readonly job_id?: string | null;
  readonly tags?: readonly string[];
  readonly due_date?: string | null;
  readonly notes?: string;
  readonly cancellation_reason?: string | null;
  readonly cancellation_requested_at?: string | null;
  readonly cancellation_admin_response?: string | null;
  readonly cancellation_discount_type?: string | null;
  readonly cancellation_discount_value?: number | null;
}

export interface RecordPaymentInput {
  readonly amount: number;
  readonly method: string;
  readonly stripe_session_id?: string;
  readonly stripe_payment_intent?: string;
  readonly status?: PaymentStatus;
  readonly note?: string;
}

export const BILLING_STATUS_LABELS: Record<BillingStatus, string> = {
  lead: "Lead",
  sent: "Sent",
  viewed: "Viewed",
  paid: "Paid",
  in_process: "In Process",
  cancellation_requested: "Cancellation Requested",
  done: "Done",
  lost: "Lost",
} as const;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
  pending: "Pending",
} as const;
