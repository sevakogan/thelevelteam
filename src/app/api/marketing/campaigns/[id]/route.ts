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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, channel, messages, sms_messages, email_messages, is_active } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (channel !== undefined) updates.channel = channel;
    if (messages !== undefined) updates.messages = messages;
    if (sms_messages !== undefined) updates.sms_messages = sms_messages;
    if (email_messages !== undefined) updates.email_messages = email_messages;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("drip_campaigns")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to update campaign:", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("drip_campaigns")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete campaign:", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
