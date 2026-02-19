import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { sendSMS } from "@/lib/marketing/twilio";

/**
 * GET /api/marketing/sms?leadId=xxx
 * Fetch SMS conversation history for a lead.
 */
export async function GET(req: NextRequest) {
  try {
    const leadId = req.nextUrl.searchParams.get("leadId");
    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("sms_messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch SMS messages:", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (err) {
    console.error("SMS GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/marketing/sms
 * Send an SMS to a lead and store it.
 * Body: { leadId: string, to: string, body: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { leadId, to, body } = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: "to and body required" }, { status: 400 });
    }

    // Send via Twilio
    const result = await sendSMS(to, body);

    // Store outbound message
    const supabase = getSupabaseAdmin();
    await supabase.from("sms_messages").insert({
      lead_id: leadId || null,
      phone: to,
      direction: "outbound",
      body,
      twilio_sid: result.sid,
      status: result.status,
    });

    return NextResponse.json({
      sid: result.sid,
      status: result.status,
    });
  } catch (err) {
    console.error("SMS POST error:", err);
    const message = err instanceof Error ? err.message : "Failed to send SMS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
