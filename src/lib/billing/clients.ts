import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { BillingClient, CreateClientInput } from "./types";

export async function getClients(userId: string): Promise<readonly BillingClient[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_clients")
    .select("*")
    .eq("user_id", userId)
    .order("company_name", { ascending: true });

  if (error) throw new Error(`Failed to fetch clients: ${error.message}`);
  return (data ?? []) as BillingClient[];
}

export async function createClient(
  userId: string,
  input: CreateClientInput
): Promise<BillingClient> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_clients")
    .insert({
      user_id: userId,
      company_name: input.company_name.trim(),
      email: input.email?.trim() ?? "",
      phone: input.phone?.trim() ?? "",
      contract_enabled: input.contract_enabled ?? false,
      contract_content: input.contract_content ?? "",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create client: ${error.message}`);
  return data as BillingClient;
}
