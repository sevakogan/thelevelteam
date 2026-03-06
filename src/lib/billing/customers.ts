/**
 * Company Billing — Data access layer
 * Follows pattern from src/lib/marketing/leads.ts
 */

import { getSupabaseAdmin } from "@/lib/supabase-server";
import type {
  BillingCustomer,
  BillingPayment,
  BillingSettings,
  CreateCustomerInput,
  UpdateCustomerInput,
  RecordPaymentInput,
} from "./types";

// ─── Customers ─────────────────────────────────────────

export async function getCustomers(userId: string): Promise<readonly BillingCustomer[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
  return (data ?? []) as BillingCustomer[];
}

export async function getCustomer(id: string): Promise<BillingCustomer | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }
  return data as BillingCustomer;
}

export async function createCustomer(
  userId: string,
  input: CreateCustomerInput
): Promise<BillingCustomer> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .insert({
      user_id: userId,
      company_name: input.company_name,
      description: input.description,
      recurring: input.recurring,
      amount: input.amount,
      phone: input.phone,
      email: input.email,
      contract_enabled: input.contract_enabled,
      contract_content: input.contract_content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }
  return data as BillingCustomer;
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<BillingCustomer> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update customer: ${error.message}`);
  }
  return data as BillingCustomer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("billing_customers")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete customer: ${error.message}`);
  }
}

// ─── Public lookup (no auth, uses service role) ────────

export async function getCustomerByToken(
  token: string
): Promise<BillingCustomer | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch customer by token: ${error.message}`);
  }
  return data as BillingCustomer;
}

// ─── Payments / Receipts ───────────────────────────────

export async function getCustomerPayments(
  customerId: string
): Promise<readonly BillingPayment[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_payments")
    .select("*")
    .eq("customer_id", customerId)
    .order("paid_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
  return (data ?? []) as BillingPayment[];
}

export async function recordPayment(
  customerId: string,
  input: RecordPaymentInput
): Promise<BillingPayment> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_payments")
    .insert({
      customer_id: customerId,
      amount: input.amount,
      method: input.method,
      stripe_session_id: input.stripe_session_id ?? null,
      stripe_payment_intent: input.stripe_payment_intent ?? null,
      status: input.status ?? "completed",
      note: input.note ?? "",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record payment: ${error.message}`);
  }
  return data as BillingPayment;
}

// ─── Billing Settings ──────────────────────────────────

export async function getBillingSettings(
  userId: string
): Promise<BillingSettings | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch billing settings: ${error.message}`);
  }
  return data as BillingSettings;
}

export async function upsertBillingSettings(
  userId: string,
  input: Partial<BillingSettings>
): Promise<BillingSettings> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_settings")
    .upsert(
      {
        user_id: userId,
        ...input,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save billing settings: ${error.message}`);
  }
  return data as BillingSettings;
}

export async function getBillingSettingsByCustomerToken(
  token: string
): Promise<BillingSettings | null> {
  const supabase = getSupabaseAdmin();

  // First get the customer to find user_id
  const { data: customer } = await supabase
    .from("billing_customers")
    .select("user_id")
    .eq("share_token", token)
    .single();

  if (!customer) return null;

  return getBillingSettings(customer.user_id);
}
