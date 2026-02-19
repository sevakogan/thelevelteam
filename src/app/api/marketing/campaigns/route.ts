import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { createSupabaseServer } from "@/lib/supabase-auth-server";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const password = req.headers.get("x-admin-password");
  if (password === process.env.ADMIN_PASSWORD) return true;

  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("drip_campaigns")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch campaigns:", err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, channel, messages, sms_messages, email_messages } = body;

    if (!name || !channel) {
      return NextResponse.json({ error: "name and channel are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("drip_campaigns")
      .insert({
        name,
        channel,
        messages: messages ?? [],
        sms_messages: sms_messages ?? null,
        email_messages: email_messages ?? null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Failed to create campaign:", err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
