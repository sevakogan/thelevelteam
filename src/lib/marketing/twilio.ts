/**
 * Twilio — SMS messaging
 *
 * Part of the unified Twilio setup:
 *   SMS   → This module (Twilio Messaging API)
 *   Email → ./sendgrid.ts (Twilio SendGrid)
 *
 * Env vars needed:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_PHONE_NUMBER
 */

import Twilio from "twilio";
import { MARKETING_CONFIG } from "./config";

function getTwilioClient() {
  return Twilio(
    MARKETING_CONFIG.twilio.accountSid(),
    MARKETING_CONFIG.twilio.authToken()
  );
}

/**
 * Normalize a US phone number to E.164 format (+1XXXXXXXXXX).
 * Twilio requires E.164; leads may be stored as "9544591697" or "+19544591697".
 */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  // Already has country code or non-US — pass through with +
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function sendSMS(to: string, body: string) {
  const client = getTwilioClient();
  const e164 = toE164(to);
  const message = await client.messages.create({
    body,
    from: MARKETING_CONFIG.twilio.phoneNumber(),
    to: e164,
  });
  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
  };
}

export function isOptOutKeyword(body: string): boolean {
  const normalized = body.trim().toUpperCase();
  const optOutWords = ["STOP", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"];
  return optOutWords.includes(normalized);
}
