/**
 * Slack incoming webhook — sends notifications to a Slack channel.
 *
 * Env var needed:
 *   SLACK_WEBHOOK_URL
 */

export async function notifySlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn("SLACK_WEBHOOK_URL not set — skipping Slack notification");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error(`Slack webhook failed: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("Slack webhook error:", err);
  }
}

/* ------------------------------------------------------------------ */
/*  Inbound message formatting (SMS + Email)                          */
/* ------------------------------------------------------------------ */

export function formatInboundSMS(from: string, body: string, leadName?: string): string {
  const sender = leadName ? `${leadName} (${from})` : from;
  return `:speech_balloon: *New SMS from ${sender}*\n>${body}`;
}

interface ResponseContext {
  readonly leadName?: string;
  readonly campaignNames: readonly string[];
}

/**
 * Format a Slack notification for an SMS reply with campaign context.
 */
export function formatSMSResponse(
  from: string,
  body: string,
  ctx: ResponseContext
): string {
  const sender = ctx.leadName ? `${ctx.leadName} (${from})` : from;
  const lines = [`:speech_balloon: *SMS Reply from ${sender}*`];

  if (ctx.campaignNames.length > 0) {
    lines.push(`:dart: Campaign${ctx.campaignNames.length > 1 ? "s" : ""}: ${ctx.campaignNames.join(", ")}`);
  }

  lines.push(`>${body}`);
  return lines.join("\n");
}

/**
 * Format a Slack notification for an email reply with campaign context.
 */
export function formatEmailResponse(
  from: string,
  subject: string,
  body: string,
  ctx: ResponseContext
): string {
  const sender = ctx.leadName ? `${ctx.leadName} (${from})` : from;
  const lines = [`:email: *Email Reply from ${sender}*`];

  if (subject) {
    lines.push(`>:pencil: Subject: ${subject}`);
  }

  if (ctx.campaignNames.length > 0) {
    lines.push(`:dart: Campaign${ctx.campaignNames.length > 1 ? "s" : ""}: ${ctx.campaignNames.join(", ")}`);
  }

  // Truncate long email bodies to first 300 chars for readability
  const preview = body.length > 300 ? `${body.slice(0, 300)}…` : body;
  lines.push(`>${preview.replace(/\n/g, "\n>")}`);

  return lines.join("\n");
}
