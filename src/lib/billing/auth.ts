/**
 * Company Billing — Auth helper
 * Shared isAuthorized + getUserId for billing API routes
 */

import { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-auth-server";

export async function isAuthorized(req: NextRequest): Promise<boolean> {
  const password = req.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (password && adminPassword && password === adminPassword) return true;

  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function getAuthUserId(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}
