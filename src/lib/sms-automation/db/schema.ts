import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Enums
export const leadStatusEnum = pgEnum('lead_status', [
  'incoming',
  'followed_up',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
  'unsubscribed',
]);

export const channelEnum = pgEnum('channel', ['sms', 'email', 'both']);

export const dripStatusEnum = pgEnum('drip_status', [
  'active',
  'completed',
  'paused',
  'unsubscribed',
]);

export const messageDirectionEnum = pgEnum('message_direction', [
  'inbound',
  'outbound',
]);

export const messageStatusEnum = pgEnum('message_status', [
  'pending',
  'sent',
  'delivered',
  'failed',
  'bounced',
]);

// Tables
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  projectInterest: text('project_interest'),
  source: text('source'),
  status: leadStatusEnum('status').default('incoming').notNull(),
  smsConsent: boolean('sms_consent').default(true).notNull(),
  emailConsent: boolean('email_consent').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dripCampaigns = pgTable('drip_campaigns', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name').notNull(),
  channel: channelEnum('channel').default('sms').notNull(),
  messages: jsonb('messages'),
  smsMessages: jsonb('sms_messages'),
  emailMessages: jsonb('email_messages'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leadDripState = pgTable('lead_drip_state', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  leadId: uuid('lead_id')
    .notNull()
    .references(() => leads.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => dripCampaigns.id, { onDelete: 'cascade' }),
  currentStep: integer('current_step').default(0).notNull(),
  nextSendAt: timestamp('next_send_at'),
  status: dripStatusEnum('status').default('active').notNull(),
  lastSentAt: timestamp('last_sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const smsMessages = pgTable('sms_messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  phone: text('phone').notNull(),
  direction: messageDirectionEnum('direction').notNull(),
  body: text('body').notNull(),
  twilioSid: text('twilio_sid'),
  status: messageStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emailMessages = pgTable('email_messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  email: text('email').notNull(),
  direction: messageDirectionEnum('direction').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: messageStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const leadsRelations = relations(leads, ({ many }) => ({
  smsMessages: many(smsMessages),
  emailMessages: many(emailMessages),
  dripStates: many(leadDripState),
}));

export const smsMessagesRelations = relations(smsMessages, ({ one }) => ({
  lead: one(leads, {
    fields: [smsMessages.leadId],
    references: [leads.id],
  }),
}));

export const emailMessagesRelations = relations(emailMessages, ({ one }) => ({
  lead: one(leads, {
    fields: [emailMessages.leadId],
    references: [leads.id],
  }),
}));

export const dripCampaignsRelations = relations(
  dripCampaigns,
  ({ many }) => ({
    states: many(leadDripState),
  })
);

export const leadDripStateRelations = relations(
  leadDripState,
  ({ one }) => ({
    lead: one(leads, {
      fields: [leadDripState.leadId],
      references: [leads.id],
    }),
    campaign: one(dripCampaigns, {
      fields: [leadDripState.campaignId],
      references: [dripCampaigns.id],
    }),
  })
);

// Widget Settings
export const widgetSettings = pgTable('widget_settings', {
  id: text('id').primaryKey().default('default'),

  // Twilio (stored encrypted)
  twilioAccountSid: text('twilio_account_sid'),
  twilioAuthToken: text('twilio_auth_token'),
  twilioPhoneNumber: text('twilio_phone_number'),

  // SendGrid (stored encrypted)
  sendgridApiKey: text('sendgrid_api_key'),
  sendgridFromEmail: text('sendgrid_from_email'),
  sendgridReplyToEmail: text('sendgrid_reply_to_email'),

  // Slack (stored encrypted)
  slackWebhookUrl: text('slack_webhook_url'),

  // Security
  adminPasswordHash: text('admin_password_hash'),
  cronSecret: text('cron_secret'),

  // Branding
  companyName: text('company_name').default('My Company'),
  primaryColor: text('primary_color').default('#3b82f6'),
  logoUrl: text('logo_url'),

  // Template URLs
  portfolioUrl: text('portfolio_url'),
  caseStudyUrl: text('case_study_url'),
  bookingUrl: text('booking_url'),

  // Metadata
  setupCompleted: boolean('setup_completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types
export type WidgetSettings = typeof widgetSettings.$inferSelect;
export type NewWidgetSettings = typeof widgetSettings.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type DripCampaign = typeof dripCampaigns.$inferSelect;
export type NewDripCampaign = typeof dripCampaigns.$inferInsert;

export type LeadDripState = typeof leadDripState.$inferSelect;
export type NewLeadDripState = typeof leadDripState.$inferInsert;

export type SmsMessage = typeof smsMessages.$inferSelect;
export type NewSmsMessage = typeof smsMessages.$inferInsert;

export type EmailMessage = typeof emailMessages.$inferSelect;
export type NewEmailMessage = typeof emailMessages.$inferInsert;
