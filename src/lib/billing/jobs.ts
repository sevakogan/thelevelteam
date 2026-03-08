/**
 * Company Billing — Jobs data access layer
 * Reusable service catalog for billing customers
 */

import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { BillingJob, CreateJobInput } from "./types";

export async function getJobs(userId: string): Promise<readonly BillingJob[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
  return (data ?? []) as BillingJob[];
}

export async function createJob(
  userId: string,
  input: CreateJobInput
): Promise<BillingJob> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_jobs")
    .insert({
      user_id: userId,
      name: input.name.trim(),
      description: input.description.trim(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A job with this name already exists");
    }
    throw new Error(`Failed to create job: ${error.message}`);
  }
  return data as BillingJob;
}

export async function deleteJob(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("billing_jobs")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete job: ${error.message}`);
  }
}
