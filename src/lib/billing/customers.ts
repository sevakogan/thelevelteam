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
  StatusEntry,
} from "./types";

// ─── Invoice Number Generation ────────────────────────

async function generateInvoiceNumber(userId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("billing_customers")
    .select("invoice_number")
    .eq("user_id", userId)
    .not("invoice_number", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  let nextNum = 1;
  if (data && data.length > 0 && data[0].invoice_number) {
    const match = (data[0].invoice_number as string).match(/INV-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }
  return `INV-${String(nextNum).padStart(3, "0")}`;
}

// ─── Normalize customer row (handle JOIN) ────────────

interface CustomerRow {
  readonly billing_jobs?: { readonly name: string } | null;
  readonly [key: string]: unknown;
}

function normalizeCustomer(row: CustomerRow): BillingCustomer {
  const { billing_jobs, ...rest } = row;
  return {
    ...rest,
    job_name: billing_jobs?.name ?? null,
    tags: (rest.tags as readonly string[]) ?? [],
    status_history: (rest.status_history as readonly StatusEntry[]) ?? [],
    cancellation_reason: (rest.cancellation_reason as string | null) ?? null,
    cancellation_requested_at:
      (rest.cancellation_requested_at as string | null) ?? null,
    cancellation_admin_response:
      (rest.cancellation_admin_response as string | null) ?? null,
    cancellation_discount_type:
      (rest.cancellation_discount_type as string | null) ?? null,
    cancellation_discount_value:
      (rest.cancellation_discount_value as number | null) ?? null,
  } as BillingCustomer;
}

// ─── Status History ────────────────────────────────────

export async function appendStatusHistory(
  customerId: string,
  status: string,
  note?: string
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Fetch current history
  const { data, error: fetchError } = await supabase
    .from("billing_customers")
    .select("status_history")
    .eq("id", customerId)
    .single();

  if (fetchError) {
    console.error("[BILLING] Failed to fetch status history:", fetchError);
    return;
  }

  const currentHistory: StatusEntry[] =
    (data?.status_history as StatusEntry[]) ?? [];

  const newEntry: StatusEntry = {
    status,
    at: new Date().toISOString(),
    ...(note ? { note } : {}),
  };

  const updatedHistory = [...currentHistory, newEntry];

  const { error: updateError } = await supabase
    .from("billing_customers")
    .update({ status_history: updatedHistory, updated_at: new Date().toISOString() })
    .eq("id", customerId);

  if (updateError) {
    console.error("[BILLING] Failed to update status history:", updateError);
  }
}

// ─── Customers ─────────────────────────────────────────

export async function getCustomers(userId: string): Promise<readonly BillingCustomer[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .select("*, billing_jobs(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
  return (data ?? []).map((row) => normalizeCustomer(row as CustomerRow));
}

export async function getCustomer(id: string): Promise<BillingCustomer | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_customers")
    .select("*, billing_jobs(name)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }
  return normalizeCustomer(data as CustomerRow);
}

export async function createCustomer(
  userId: string,
  input: CreateCustomerInput
): Promise<BillingCustomer> {
  const invoiceNumber = await generateInvoiceNumber(userId);
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
      job_id: input.job_id,
      tags: input.tags,
      due_date: input.due_date,
      invoice_number: invoiceNumber,
      notes: input.notes,
    })
    .select("*, billing_jobs(name)")
    .single();

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }
  return normalizeCustomer(data as CustomerRow);
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<BillingCustomer> {
  const supabase = getSupabaseAdmin();

  // Build update payload — exclude job_name (computed field)
  const { ...updateData } = input;

  const { data, error } = await supabase
    .from("billing_customers")
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, billing_jobs(name)")
    .single();

  if (error) {
    throw new Error(`Failed to update customer: ${error.message}`);
  }
  return normalizeCustomer(data as CustomerRow);
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
    .select("*, billing_jobs(name)")
    .eq("share_token", token)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch customer by token: ${error.message}`);
  }
  return normalizeCustomer(data as CustomerRow);
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

export async function updatePaymentStatus(
  paymentId: string,
  status: "completed" | "failed" | "refunded" | "pending",
  note?: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const update: Record<string, unknown> = { status };
  if (note !== undefined) update.note = note;
  const { error } = await supabase
    .from("billing_payments")
    .update(update)
    .eq("id", paymentId);

  if (error) {
    throw new Error(`Failed to update payment: ${error.message}`);
  }
}

export async function getPayment(paymentId: string): Promise<BillingPayment | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch payment: ${error.message}`);
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
