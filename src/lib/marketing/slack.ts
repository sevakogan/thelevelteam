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

export function formatInboundSMS(from: string, body: string, leadName?: string): string {
  const sender = leadName ? `${leadName} (${from})` : from;
  return `:speech_balloon: *New SMS from ${sender}*\n>${body}`;
}
