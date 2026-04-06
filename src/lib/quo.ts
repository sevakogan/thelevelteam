/**
 * Quo (formerly OpenPhone) SMS integration.
 * Sends auto-reply + lead details to the client's phone.
 * Both messages appear in the same Quo inbox thread.
 *
 * API docs: https://www.quo.com/docs/api-reference/
 */

const QUO_API = "https://api.openphone.com/v1";

// ── YOUR QUO PHONE NUMBER (E.164 format) ──
const QUO_FROM_NUMBER = "+16507538355";

interface QuoLeadData {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly source: string;
  readonly message?: string;
  readonly projectInterest?: string;
  readonly [key: string]: string | undefined;
}

/**
 * Send two SMS to the lead's phone:
 * 1. Auto-reply: friendly acknowledgment
 * 2. Lead details: full info dump (visible in your Quo thread)
 *
 * Designed to run inside Promise.allSettled() so failures don't block.
 */
export async function pushLeadToQuo(data: QuoLeadData): Promise<void> {
  const apiKey = process.env.QUO_API_KEY;
  if (!apiKey) {
    console.warn("[Quo] QUO_API_KEY not set — skipping");
    return;
  }

  if (!data.phone) {
    console.warn("[Quo] No phone number provided — skipping");
    return;
  }

  const clientPhone = normalizePhone(data.phone);

  // 1. Auto-reply to client
  await sendSms(apiKey, clientPhone, buildAutoReply(data.source));

  // 2. Lead details (also visible in your Quo inbox)
  await sendSms(apiKey, clientPhone, buildLeadDetails(data));
}

/**
 * Customize these messages per source/form type.
 */
function buildAutoReply(source: string): string {
  const messages: Record<string, string> = {
    website:
      "Hey! Thanks for reaching out to TheLevelTeam 🙌 We got your inquiry and someone from our team will get back to you shortly. Talk soon!",
    contact:
      "Hey! Thanks for reaching out to TheLevelTeam 🙌 We got your inquiry and someone from our team will get back to you shortly. Talk soon!",
    modal:
      "Hey! Thanks for your interest in working with TheLevelTeam! We received your info and will reach out shortly.",
  };
  return messages[source] ?? messages.website;
}

/**
 * Builds a structured text summary of the lead.
 */
function buildLeadDetails(data: QuoLeadData): string {
  const lines: (string | null)[] = [
    `— New Lead (${data.source}) —`,
    "",
    `Name: ${data.name}`,
    data.email ? `Email: ${data.email}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    data.projectInterest ? `Interest: ${data.projectInterest}` : null,
    data.message
      ? `\nMessage: ${data.message.slice(0, 800)}${data.message.length > 800 ? "..." : ""}`
      : null,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

async function sendSms(
  apiKey: string,
  to: string,
  content: string
): Promise<void> {
  const res = await fetch(`${QUO_API}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      content,
      from: QUO_FROM_NUMBER,
      to: [to],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("[Quo] Send message error:", res.status, body);
  }
}

/** Normalize a phone string to E.164 format (+1XXXXXXXXXX). */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}
