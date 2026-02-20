import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getCampaignNamesForLead } from "@/lib/marketing/drip";
import { notifySlack, formatEmailResponse } from "@/lib/marketing/slack";

/**
 * SendGrid Inbound Parse webhook — receives email replies from leads.
 *
 * SendGrid posts multipart/form-data with fields:
 *   from, to, subject, text, html, envelope, etc.
 *
 * Setup required:
 *   1. Add MX record: mx.sendgrid.net (priority 10) for your reply subdomain
 *   2. Configure Inbound Parse in SendGrid dashboard:
 *      Host: reply.thelevelteam.com (or similar subdomain)
 *      URL:  https://thelevelteam.vercel.app/api/marketing/webhooks/sendgrid/inbound
 *      Check "POST the raw, full MIME message" = OFF (we want parsed)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const from = formData.get("from") as string | null;
    const subject = formData.get("subject") as string | null;
    const text = formData.get("text") as string | null;
    const envelope = formData.get("envelope") as string | null;

    if (!from) {
      return NextResponse.json({ error: "Missing from" }, { status: 400 });
    }

    // Extract the email address from "Name <email@example.com>" format
    const emailMatch = from.match(/<([^>]+)>/) ?? [null, from.trim()];
    const senderEmail = emailMatch[1] ?? from.trim();

    // Extract plain text body — strip quoted reply content
    const body = stripQuotedReply(text ?? "");

    if (!body.trim()) {
      // Empty reply (e.g. just a signature or quoted text) — skip notification
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();

    // Look up the lead by email
    const { data: lead } = await supabase
      .from("leads")
      .select("id, name")
      .eq("email", senderEmail)
      .single();

    // Store the inbound email in a log (optional — for conversation tracking)
    await supabase.from("email_messages").insert({
      lead_id: lead?.id ?? null,
      email: senderEmail,
      direction: "inbound",
      subject: subject ?? "",
      body,
      envelope: envelope ? JSON.parse(envelope) : null,
    }).then(({ error }) => {
      // Table might not exist yet — log but don't fail
      if (error) console.warn("Could not store inbound email:", error.message);
    });

    // Look up campaign context and notify Slack
    const campaignNames = lead ? await getCampaignNamesForLead(lead.id) : [];
    await notifySlack(
      formatEmailResponse(senderEmail, subject ?? "", body, {
        leadName: lead?.name,
        campaignNames,
      })
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("SendGrid inbound parse error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

/**
 * Strip quoted reply content from an email body.
 * Removes lines starting with ">" and common reply headers like "On ... wrote:".
 */
function stripQuotedReply(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    // Stop at common reply boundaries
    if (/^On .+ wrote:$/i.test(line.trim())) break;
    if (/^-{2,}\s*Original Message\s*-{2,}$/i.test(line.trim())) break;
    if (/^From:.*@/i.test(line.trim())) break;

    // Skip quoted lines
    if (line.trim().startsWith(">")) continue;

    result.push(line);
  }

  return result.join("\n").trim();
}
