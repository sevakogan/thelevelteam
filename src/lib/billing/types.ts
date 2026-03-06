/**
 * Company Billing — Type definitions
 */

export type BillingStatus = "draft" | "sent" | "active" | "cancelled" | "paid";

export type PaymentStatus = "completed" | "failed" | "refunded" | "pending";

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
  readonly created_at: string;
  readonly updated_at: string;
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
  draft: "Draft",
  sent: "Sent",
  active: "Active",
  cancelled: "Cancelled",
  paid: "Paid",
} as const;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
  pending: "Pending",
} as const;
