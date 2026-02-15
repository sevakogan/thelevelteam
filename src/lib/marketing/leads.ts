import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { Lead, LeadInput, LeadStatus } from "./types";

export async function createLead(input: LeadInput): Promise<Lead> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message ?? null,
      project_interest: input.projectInterest ?? null,
      source: input.source ?? "website",
      sms_consent: input.smsConsent,
      email_consent: input.emailConsent,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  return data as Lead;
}

export async function getLeads(): Promise<readonly Lead[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return data as Lead[];
}

export async function updateLead(
  id: string,
  fields: Partial<Omit<Lead, "id" | "created_at">>
): Promise<Lead> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`);
  }

  return data as Lead;
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete lead: ${error.message}`);
  }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`);
  }

  return data as Lead;
}

export async function unsubscribeLead(
  id: string,
  channel: "sms" | "email"
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const field = channel === "sms" ? "sms_consent" : "email_consent";
  const { error } = await supabase
    .from("leads")
    .update({ [field]: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to unsubscribe lead: ${error.message}`);
  }
}
