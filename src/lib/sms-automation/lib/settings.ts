import { db } from '../db';
import { widgetSettings, WidgetSettings } from '../db/schema';
import { eq } from 'drizzle-orm';
import { encrypt, decrypt, maskValue } from './crypto';

const SETTINGS_ID = 'default';
const CACHE_TTL_MS = 60_000;

const SENSITIVE_FIELDS = [
  'twilioAccountSid',
  'twilioAuthToken',
  'twilioPhoneNumber',
  'sendgridApiKey',
  'sendgridFromEmail',
  'sendgridReplyToEmail',
  'slackWebhookUrl',
  'cronSecret',
] as const;

type SensitiveField = typeof SENSITIVE_FIELDS[number];

/**
 * Decrypted settings with all sensitive fields as plain strings.
 */
export interface DecryptedSettings {
  twilioAccountSid: string | null;
  twilioAuthToken: string | null;
  twilioPhoneNumber: string | null;
  sendgridApiKey: string | null;
  sendgridFromEmail: string | null;
  sendgridReplyToEmail: string | null;
  slackWebhookUrl: string | null;
  cronSecret: string | null;
  adminPasswordHash: string | null;
  companyName: string | null;
  primaryColor: string | null;
  logoUrl: string | null;
  portfolioUrl: string | null;
  caseStudyUrl: string | null;
  bookingUrl: string | null;
  setupCompleted: boolean;
  updatedAt: Date;
}

/**
 * Masked settings for display (sensitive values hidden).
 */
export interface MaskedSettings {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  sendgridApiKey: string;
  sendgridFromEmail: string;
  sendgridReplyToEmail: string;
  slackWebhookUrl: string;
  cronSecret: string;
  hasAdminPassword: boolean;
  companyName: string | null;
  primaryColor: string | null;
  logoUrl: string | null;
  portfolioUrl: string | null;
  caseStudyUrl: string | null;
  bookingUrl: string | null;
  setupCompleted: boolean;
}

// In-memory cache
let _cache: { data: WidgetSettings; timestamp: number } | null = null;

/**
 * Get raw settings from DB (with cache).
 */
export async function getSettings(): Promise<WidgetSettings | null> {
  if (_cache && Date.now() - _cache.timestamp < CACHE_TTL_MS) {
    return _cache.data;
  }

  try {
    const [settings] = await db
      .select()
      .from(widgetSettings)
      .where(eq(widgetSettings.id, SETTINGS_ID));

    if (settings) {
      _cache = { data: settings, timestamp: Date.now() };
    }

    return settings || null;
  } catch {
    return null;
  }
}

/**
 * Get settings with sensitive fields decrypted.
 */
export async function getDecryptedSettings(): Promise<DecryptedSettings> {
  const settings = await getSettings();

  if (!settings) {
    return {
      twilioAccountSid: null,
      twilioAuthToken: null,
      twilioPhoneNumber: null,
      sendgridApiKey: null,
      sendgridFromEmail: null,
      sendgridReplyToEmail: null,
      slackWebhookUrl: null,
      cronSecret: null,
      adminPasswordHash: null,
      companyName: null,
      primaryColor: '#3b82f6',
      logoUrl: null,
      portfolioUrl: null,
      caseStudyUrl: null,
      bookingUrl: null,
      setupCompleted: false,
      updatedAt: new Date(),
    };
  }

  const decrypted: Record<string, unknown> = { ...settings };

  for (const field of SENSITIVE_FIELDS) {
    const value = settings[field];
    if (value) {
      try {
        decrypted[field] = decrypt(value);
      } catch {
        decrypted[field] = null;
      }
    }
  }

  return decrypted as unknown as DecryptedSettings;
}

/**
 * Get settings with sensitive values masked (for API responses).
 */
export async function getMaskedSettings(): Promise<MaskedSettings> {
  const decrypted = await getDecryptedSettings();

  return {
    twilioAccountSid: maskValue(decrypted.twilioAccountSid),
    twilioAuthToken: maskValue(decrypted.twilioAuthToken),
    twilioPhoneNumber: maskValue(decrypted.twilioPhoneNumber),
    sendgridApiKey: maskValue(decrypted.sendgridApiKey),
    sendgridFromEmail: decrypted.sendgridFromEmail || '',
    sendgridReplyToEmail: decrypted.sendgridReplyToEmail || '',
    slackWebhookUrl: maskValue(decrypted.slackWebhookUrl),
    cronSecret: maskValue(decrypted.cronSecret),
    hasAdminPassword: !!decrypted.adminPasswordHash,
    companyName: decrypted.companyName,
    primaryColor: decrypted.primaryColor,
    logoUrl: decrypted.logoUrl,
    portfolioUrl: decrypted.portfolioUrl,
    caseStudyUrl: decrypted.caseStudyUrl,
    bookingUrl: decrypted.bookingUrl,
    setupCompleted: decrypted.setupCompleted,
  };
}

/**
 * Update settings. Encrypts sensitive fields before saving.
 */
export async function updateSettings(
  data: Partial<Record<string, string | boolean | null>>
): Promise<WidgetSettings> {
  const toSave: Record<string, unknown> = { updatedAt: new Date() };

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    if (SENSITIVE_FIELDS.includes(key as SensitiveField) && typeof value === 'string' && value.length > 0) {
      toSave[key] = encrypt(value);
    } else {
      toSave[key] = value;
    }
  }

  // Upsert: try update first, insert if no row exists
  const [existing] = await db
    .select({ id: widgetSettings.id })
    .from(widgetSettings)
    .where(eq(widgetSettings.id, SETTINGS_ID));

  let result: WidgetSettings;

  if (existing) {
    const [updated] = await db
      .update(widgetSettings)
      .set(toSave)
      .where(eq(widgetSettings.id, SETTINGS_ID))
      .returning();
    result = updated;
  } else {
    const [inserted] = await db
      .insert(widgetSettings)
      .values({ id: SETTINGS_ID, ...toSave })
      .returning();
    result = inserted;
  }

  invalidateSettingsCache();
  return result;
}

/**
 * Check if the initial setup has been completed.
 */
export async function isSetupComplete(): Promise<boolean> {
  const settings = await getSettings();
  return settings?.setupCompleted ?? false;
}

/**
 * Clear the in-memory settings cache.
 */
export function invalidateSettingsCache(): void {
  _cache = null;
}
