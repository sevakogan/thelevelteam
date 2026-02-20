import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/marketing/sendgrid";
import { buildDripEmailHTML } from "@/lib/marketing/templates";
import type { Lead } from "@/lib/marketing/types";

/**
 * GET /api/marketing/email?leadId=xxx
 * Fetch email conversation history for a lead.
 */
export async function GET(req: NextRequest) {
  try {
    const leadId = req.nextUrl.searchParams.get("leadId");
    if (!leadId) {
      return NextResponse.json({ error: "leadId required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("email_messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch email messages:", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    // Map DB rows → MessageLog shape the UI expects
    const messages = (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      lead_id: row.lead_id,
      channel: "email" as const,
      to: row.direction === "inbound" ? "you" : row.email,
      subject: row.subject || undefined,
      body: row.body,
      status: row.status ?? "sent",
      sent_at: row.created_at,
    }));

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Email GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/marketing/email
 * Send an email to a lead and store it.
 * Body: { leadId: string, to: string, subject: string, body: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { leadId, to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "to, subject, and body required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch lead for email template personalization
    let lead: Lead | null = null;
    if (leadId) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();
      lead = data as Lead | null;
    }

    // Build branded HTML email
    const html = lead
      ? buildDripEmailHTML(subject, body, lead)
      : `<div style="font-family:sans-serif;padding:20px"><h2>${subject}</h2><p>${body.replace(/\n/g, "<br>")}</p></div>`;

    // Send via SendGrid
    await sendEmail(to, subject, html);

    // Store outbound message
    await supabase.from("email_messages").insert({
      lead_id: leadId || null,
      email: to,
      direction: "outbound",
      subject,
      body,
      status: "sent",
    });

    return NextResponse.json({ to, subject, status: "sent" });
  } catch (err) {
    console.error("Email POST error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
