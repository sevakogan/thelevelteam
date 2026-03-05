import { Lead } from '../db/schema';

export interface SlackMessage {
  text: string;
  blocks?: Array<Record<string, unknown>>;
}

/**
 * Get the Slack webhook URL from DB settings or env var.
 */
async function getWebhookUrl(): Promise<string | null> {
  try {
    const { getDecryptedSettings } = await import('../lib/settings');
    const settings = await getDecryptedSettings();
    if (settings.slackWebhookUrl) {
      return settings.slackWebhookUrl;
    }
  } catch {
    // Settings not available yet
  }

  return process.env.SLACK_WEBHOOK_URL || null;
}

/**
 * Send a notification to Slack.
 * Gracefully fails if webhook URL is not configured.
 */
export async function notifySlack(message: SlackMessage): Promise<boolean> {
  const webhookUrl = await getWebhookUrl();

  if (!webhookUrl) {
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Slack webhook returned non-200 status:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

/**
 * Format a new lead notification for Slack
 */
export function formatNewLeadSlack(lead: Lead): SlackMessage {
  return {
    text: `New lead: ${lead.name}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '*New Lead Arrived*' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${lead.name}` },
          { type: 'mrkdwn', text: `*Email:*\n${lead.email}` },
          { type: 'mrkdwn', text: `*Phone:*\n${lead.phone}` },
          { type: 'mrkdwn', text: `*Source:*\n${lead.source || 'Not specified'}` },
        ],
      },
      ...(lead.message
        ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Message:*\n${lead.message}` } }]
        : []),
      ...(lead.projectInterest
        ? [{ type: 'section', text: { type: 'mrkdwn', text: `*Project Interest:*\n${lead.projectInterest}` } }]
        : []),
      { type: 'divider' },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `_Received ${new Date(lead.createdAt).toLocaleString()}_` },
      },
    ],
  };
}

/**
 * Format an SMS response notification for Slack
 */
export function formatSMSResponse(
  from: string,
  body: string,
  context?: { leadName?: string; leadId?: string }
): SlackMessage {
  return {
    text: `SMS reply from ${from}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: '*SMS Reply Received*' } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From:*\n${from}` },
          ...(context?.leadName
            ? [{ type: 'mrkdwn', text: `*Lead:*\n${context.leadName}` }]
            : []),
        ],
      },
      { type: 'section', text: { type: 'mrkdwn', text: `> ${body}` } },
      { type: 'divider' },
      { type: 'section', text: { type: 'mrkdwn', text: `_${new Date().toLocaleString()}_` } },
    ],
  };
}

/**
 * Format an email response notification for Slack
 */
export function formatEmailResponse(
  from: string,
  subject: string,
  body: string,
  context?: { leadName?: string; leadId?: string }
): SlackMessage {
  const truncatedBody = body.length > 200 ? body.substring(0, 200) + '...' : body;

  return {
    text: `Email reply from ${from}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: '*Email Reply Received*' } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From:*\n${from}` },
          ...(context?.leadName
            ? [{ type: 'mrkdwn', text: `*Lead:*\n${context.leadName}` }]
            : []),
        ],
      },
      { type: 'section', text: { type: 'mrkdwn', text: `*Subject:*\n${subject}` } },
      { type: 'section', text: { type: 'mrkdwn', text: `> ${truncatedBody}` } },
      { type: 'divider' },
      { type: 'section', text: { type: 'mrkdwn', text: `_${new Date().toLocaleString()}_` } },
    ],
  };
}

/**
 * Format a drip campaign event for Slack
 */
export function formatDripEventSlack(event: {
  type: 'enrolled' | 'completed' | 'paused' | 'sent';
  leadName: string;
  campaignName: string;
  stepNumber?: number;
}): SlackMessage {
  const eventLabels: Record<string, string> = {
    enrolled: 'Enrolled in campaign',
    completed: 'Campaign completed',
    paused: 'Campaign paused',
    sent: 'Message sent',
  };
  const eventText = eventLabels[event.type];

  return {
    text: `${eventText}: ${event.leadName} - ${event.campaignName}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: eventText } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Lead:*\n${event.leadName}` },
          { type: 'mrkdwn', text: `*Campaign:*\n${event.campaignName}` },
          ...(event.stepNumber
            ? [{ type: 'mrkdwn', text: `*Step:*\n${event.stepNumber}` }]
            : []),
        ],
      },
    ],
  };
}
