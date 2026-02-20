import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { isOptOutKeyword } from "@/lib/marketing/twilio";
import { unsubscribeLead } from "@/lib/marketing/leads";
import { pauseCampaignsForLead, getCampaignNamesForLead } from "@/lib/marketing/drip";
import { notifySlack, formatSMSResponse } from "@/lib/marketing/slack";

function twiml(body = "") {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`,
    { status: 200, headers: { "Content-Type": "text/xml" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string | null;
    const body = formData.get("Body") as string | null;
    const messageStatus = formData.get("MessageStatus") as string | null;

    if (!from || !body) {
      // Status callback only (no message body) — just log
      if (messageStatus) {
        console.log(`Twilio status: ${messageStatus} from ${from ?? "unknown"}`);
      }
      return twiml();
    }

    const supabase = getSupabaseAdmin();

    // Look up the lead by phone number
    const { data: lead } = await supabase
      .from("leads")
      .select("id, name")
      .eq("phone", from)
      .single();

    // Handle opt-out
    if (isOptOutKeyword(body)) {
      if (lead) {
        await unsubscribeLead(lead.id, "sms");
        await pauseCampaignsForLead(lead.id, "sms");
      }
      return twiml();
    }

    // Store inbound message
    await supabase.from("sms_messages").insert({
      lead_id: lead?.id ?? null,
      phone: from,
      direction: "inbound",
      body,
    });

    // Look up campaign context and notify Slack
    const campaignNames = lead ? await getCampaignNamesForLead(lead.id) : [];
    await notifySlack(
      formatSMSResponse(from, body, {
        leadName: lead?.name,
        campaignNames,
      })
    );

    return twiml();
  } catch (err) {
    console.error("Twilio webhook error:", err);
    return twiml();
  }
}
