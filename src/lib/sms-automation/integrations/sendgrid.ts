import sgMail from '@sendgrid/mail';
import { IntegrationError } from '../utils/errors';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  to: string;
  subject: string;
  status: 'sent' | 'queued';
  messageId?: string;
}

interface SendGridState {
  fromEmail: string;
  replyToEmail: string | undefined;
  settingsHash: string;
}

let _state: SendGridState | null = null;

/**
 * Initialize SendGrid lazily from DB settings or env vars.
 */
async function getSendGridState(): Promise<SendGridState> {
  let apiKey: string | undefined;
  let fromEmail: string | undefined;
  let replyToEmail: string | undefined;
  let settingsHash = '';

  try {
    const { getDecryptedSettings } = await import('../lib/settings');
    const settings = await getDecryptedSettings();
    if (settings.sendgridApiKey && settings.sendgridFromEmail) {
      apiKey = settings.sendgridApiKey;
      fromEmail = settings.sendgridFromEmail;
      replyToEmail = settings.sendgridReplyToEmail ?? undefined;
      settingsHash = `${apiKey?.slice(-4)}:${fromEmail}`;
    }
  } catch {
    // Settings not available yet, try env vars
  }

  if (!apiKey || !fromEmail) {
    apiKey = process.env.SENDGRID_API_KEY;
    fromEmail = process.env.SENDGRID_FROM_EMAIL;
    replyToEmail = process.env.SENDGRID_REPLY_TO_EMAIL;
    settingsHash = `env:${apiKey?.slice(-4)}:${fromEmail}`;
  }

  if (!apiKey || !fromEmail) {
    throw new IntegrationError(
      'SendGrid',
      'SendGrid is not configured. Please configure it in Settings or set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL environment variables.'
    );
  }

  if (!_state || _state.settingsHash !== settingsHash) {
    sgMail.setApiKey(apiKey);
    _state = { fromEmail, replyToEmail, settingsHash };
  }

  return _state;
}

/**
 * Send an email via SendGrid
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { fromEmail, replyToEmail } = await getSendGridState();

  try {
    const message = {
      to: params.to,
      from: fromEmail,
      replyTo: params.replyTo || replyToEmail || fromEmail,
      subject: params.subject,
      html: params.html,
      text: params.text,
    };

    const [response] = await sgMail.send(message);

    return {
      to: params.to,
      subject: params.subject,
      status: 'sent',
      messageId: response.headers['x-message-id'],
    };
  } catch (error) {
    console.error('SendGrid email send error:', error);
    throw new IntegrationError(
      'SendGrid',
      `Failed to send email: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Build a branded HTML email template
 */
export function buildEmailHTML(params: {
  subject: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}): string {
  const {
    headline,
    body,
    ctaText,
    ctaUrl,
    companyName = 'Our Company',
    logoUrl,
    primaryColor = '#3b82f6',
  } = params;

  const ctaButton = ctaText && ctaUrl
    ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${ctaUrl}" style="
          display: inline-block;
          padding: 12px 32px;
          background-color: ${primaryColor};
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
        ">${ctaText}</a>
      </div>
    `
    : '';

  const logo = logoUrl
    ? `<img src="${logoUrl}" alt="${companyName}" style="max-width: 200px; margin-bottom: 24px;" />`
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          a { color: ${primaryColor}; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px;">
          ${logo}
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #1f2937;">
            ${headline}
          </h1>
          <div style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
            ${body}
          </div>
          ${ctaButton}
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <div style="font-size: 12px; color: #9ca3af; text-align: center;">
            <p>${companyName} &copy; ${new Date().getFullYear()}</p>
            <p>You're receiving this email because you signed up for our services.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send a batch of emails
 */
export async function sendBatchEmails(
  emails: SendEmailParams[]
): Promise<SendEmailResult[]> {
  const results: SendEmailResult[] = [];

  for (const emailParams of emails) {
    try {
      const result = await sendEmail(emailParams);
      results.push(result);
    } catch (error) {
      console.error(`Failed to send email to ${emailParams.to}:`, error);
      results.push({
        to: emailParams.to,
        subject: emailParams.subject,
        status: 'queued',
      });
    }
  }

  return results;
}

/**
 * Reset the cached state (for when settings change)
 */
export function resetSendGridState(): void {
  _state = null;
}
