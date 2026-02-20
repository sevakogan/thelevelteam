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

    // Look up the lead by phone number (try exact match first, then stripped)
    const stripped = from.replace(/^\+1/, "").replace(/\D/g, "");
    let lead: { id: string; name: string } | null = null;

    const { data: exactMatch } = await supabase
      .from("leads")
      .select("id, name")
      .eq("phone", from)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (exactMatch) {
      lead = exactMatch;
    } else {
      // Try matching without country code (some leads stored as 9544591697)
      const { data: fuzzyMatch } = await supabase
        .from("leads")
        .select("id, name")
        .or(`phone.eq.${stripped},phone.eq.+1${stripped},phone.ilike.%${stripped}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      lead = fuzzyMatch;
    }

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
