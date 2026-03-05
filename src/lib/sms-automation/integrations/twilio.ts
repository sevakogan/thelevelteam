import twilio from 'twilio';
import { IntegrationError } from '../utils/errors';

export interface SendSmsResult {
  sid: string;
  status: string;
  to: string;
  from: string;
}

export interface SendSmsParams {
  to: string;
  body: string;
}

export interface TwilioWebhookPayload {
  AccountSid: string;
  MessageSid: string;
  AccountId: string;
  MessagingServiceSid?: string;
  From: string;
  To: string;
  Body: string;
  NumMedia: string;
}

interface TwilioClientState {
  client: ReturnType<typeof twilio>;
  phoneNumber: string;
  settingsHash: string;
}

let _state: TwilioClientState | null = null;

/**
 * Get a lazy-initialized Twilio client.
 * Reads credentials from DB settings (via getDecryptedSettings) or env vars as fallback.
 */
async function getTwilioClient(): Promise<TwilioClientState> {
  // Try DB settings first, fall back to env vars
  let accountSid: string | undefined;
  let authToken: string | undefined;
  let phoneNumber: string | undefined;
  let settingsHash = '';

  try {
    const { getDecryptedSettings } = await import('../lib/settings');
    const settings = await getDecryptedSettings();
    if (settings.twilioAccountSid && settings.twilioAuthToken && settings.twilioPhoneNumber) {
      accountSid = settings.twilioAccountSid;
      authToken = settings.twilioAuthToken;
      phoneNumber = settings.twilioPhoneNumber;
      settingsHash = `${accountSid}:${phoneNumber}`;
    }
  } catch {
    // Settings not available yet, try env vars
  }

  // Fallback to env vars
  if (!accountSid || !authToken || !phoneNumber) {
    accountSid = process.env.TWILIO_ACCOUNT_SID;
    authToken = process.env.TWILIO_AUTH_TOKEN;
    phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    settingsHash = `env:${accountSid}:${phoneNumber}`;
  }

  if (!accountSid || !authToken || !phoneNumber) {
    throw new IntegrationError(
      'Twilio',
      'Twilio is not configured. Please configure it in Settings or set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.'
    );
  }

  // Reuse client if settings haven't changed
  if (_state && _state.settingsHash === settingsHash) {
    return _state;
  }

  _state = {
    client: twilio(accountSid, authToken),
    phoneNumber,
    settingsHash,
  };

  return _state;
}

/**
 * Send an SMS via Twilio
 */
export async function sendSMS(params: SendSmsParams): Promise<SendSmsResult> {
  const { client, phoneNumber } = await getTwilioClient();

  try {
    const message = await client.messages.create({
      body: params.body,
      from: phoneNumber,
      to: toE164(params.to),
    });

    return {
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
    };
  } catch (error) {
    console.error('Twilio SMS send error:', error);
    throw new IntegrationError(
      'Twilio',
      `Failed to send SMS: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Convert phone number to E.164 format (+1XXXXXXXXXX)
 */
export function toE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // 10 digits: assume US number
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  // 11 digits starting with 1: US format
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }

  // All other lengths: assume country code is included
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

/**
 * Check if a message contains an opt-out keyword
 */
export function isOptOutKeyword(body: string): boolean {
  const optOutKeywords = ['stop', 'unsubscribe', 'quit', 'cancel', 'end'];
  const normalizedBody = body.toLowerCase().trim();

  return optOutKeywords.includes(normalizedBody);
}

/**
 * Validate Twilio webhook signature
 */
export function validateTwilioWebhook(
  url: string,
  params: Record<string, string>,
  signature: string,
  twilioAuthToken: string
): boolean {
  try {
    const twilioLib = require('twilio');
    return twilioLib.validateRequest(twilioAuthToken, signature, url, params);
  } catch (error) {
    console.error('Twilio webhook validation error:', error);
    return false;
  }
}

/**
 * Get message status
 */
export async function getMessageStatus(messageSid: string): Promise<string> {
  const { client } = await getTwilioClient();

  try {
    const message = await client.messages(messageSid).fetch();
    return message.status;
  } catch (error) {
    console.error('Failed to fetch message status:', error);
    throw new IntegrationError(
      'Twilio',
      `Failed to fetch message status: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Reset the cached client (for when settings change)
 */
export function resetTwilioClient(): void {
  _state = null;
}
