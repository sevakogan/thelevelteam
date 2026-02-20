import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { createSupabaseServer } from "@/lib/supabase-auth-server";

/**
 * GET — returns count of leads created since the user last checked.
 * POST — marks leads as "seen" (updates the last-checked timestamp).
 *
 * Uses a simple `notification_state` table row keyed by user id.
 * Falls back to "last 5 minutes" if no state exists yet.
 */

async function getUserId(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const supabase = getSupabaseAdmin();

    // Get the last-seen timestamp for this user
    const { data: state } = await supabase
      .from("notification_state")
      .select("leads_seen_at")
      .eq("user_id", userId)
      .single();

    // Default: 5 minutes ago if no state exists
    const since = state?.leads_seen_at ?? new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gt("created_at", since);

    if (error) {
      console.warn("Failed to count recent leads:", error.message);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("Recent leads check failed:", err);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Upsert the last-seen timestamp
    const { error } = await supabase
      .from("notification_state")
      .upsert(
        { user_id: userId, leads_seen_at: now },
        { onConflict: "user_id" }
      );

    if (error) {
      console.warn("Failed to update notification state:", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mark leads seen failed:", err);
    return NextResponse.json({ ok: true });
  }
}
