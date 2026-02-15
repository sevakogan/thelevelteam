/**
 * Marketing configuration — the ONLY file to customize per project snapshot.
 * All project-specific settings live here.
 */

export const MARKETING_CONFIG = {
  company: {
    name: "TheLevelTeam",
    website: "https://thelevelteam.com",
    supportEmail: "info@thelevelteam.com",
  },

  twilio: {
    accountSid: () => process.env.TWILIO_ACCOUNT_SID!,
    authToken: () => process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: () => process.env.TWILIO_PHONE_NUMBER!,
  },

  sendgrid: {
    apiKey: () => process.env.SENDGRID_API_KEY!,
    fromEmail: () => process.env.SENDGRID_FROM_EMAIL || "info@thelevelteam.com",
    fromName: () => "TheLevelTeam",
  },

  cron: {
    secret: () => process.env.CRON_SECRET!,
  },

  webhooks: {
    secret: () => process.env.MARKETING_WEBHOOK_SECRET!,
  },
} as const;
