/**
 * SMS Automation Widget - Main Entry Point
 * Exports all components, hooks, utilities, and configuration
 */

// Components
export { LeadCaptureForm } from './components/LeadCaptureForm';
export { SMSDashboard } from './components/SMSDashboard';
export { CampaignManager } from './components/CampaignManager';
export { SetupWizard } from './components/SetupWizard';
export { SettingsPanel } from './components/SettingsPanel';

// Hooks
export { useLeads, useLead, useCreateLead } from './hooks/useLeads';
export { useSMSConversation, useSendSMS } from './hooks/useSMS';
export { useCampaigns, useCampaign } from './hooks/useCampaigns';
export { useNotifications, NotificationContainer } from './hooks/useNotifications';
export { useSetupStatus, useSettings, useUpdateSettings } from './hooks/useSettings';

// Database
export {
  leads,
  dripCampaigns,
  leadDripState,
  smsMessages,
  emailMessages,
  leadStatusEnum,
  channelEnum,
  dripStatusEnum,
  messageDirectionEnum,
  messageStatusEnum,
} from './db/schema';

export type {
  Lead,
  NewLead,
  DripCampaign,
  NewDripCampaign,
  LeadDripState,
  NewLeadDripState,
  SmsMessage,
  NewSmsMessage,
  EmailMessage,
  NewEmailMessage,
  WidgetSettings,
  NewWidgetSettings,
} from './db/schema';

// Settings
export {
  getSettings,
  getDecryptedSettings,
  getMaskedSettings,
  updateSettings,
  isSetupComplete,
  invalidateSettingsCache,
} from './lib/settings';

export { verifyAdminAuth, verifyCronAuth } from './lib/auth';

// Library Functions
export {
  createLead,
  getLeads,
  getLeadById,
  getLeadByEmail,
  getLeadByPhone,
  updateLead,
  updateLeadStatus,
  unsubscribeLead,
  deleteLead,
  getLeadConversationHistory,
  normalizeLead,
  searchLeads,
} from './lib/leads';

export {
  getActiveCampaigns,
  getCampaignById,
  createDripCampaign,
  updateDripCampaign,
  toggleCampaignActive,
  enrollLeadInCampaigns,
  getActiveLeadDripStates,
  getCampaignNamesForLead,
  pauseCampaignsForLead,
  processNextDripMessages,
  getAllDripCampaigns,
} from './lib/drip';

export {
  interpolateTemplate,
  getWelcomeSMS,
  getDripSMS,
  getWelcomeEmail,
  getDripEmail,
  buildEmailTemplate,
  getSMSCharacterCount,
  getSMSSegmentCount,
} from './lib/templates';

export {
  leadFormSchema,
  dripMessageSchema,
  campaignSchema,
  sendSmsSchema,
  sendEmailSchema,
  updateLeadSchema,
  validateData,
} from './lib/validation';

export type {
  LeadFormData,
  DripMessage,
  CampaignData,
  SendSmsData,
  SendEmailData,
  UpdateLeadData,
} from './lib/validation';

// Integrations
export { sendSMS, toE164, isOptOutKeyword } from './integrations/twilio';
export { sendEmail, buildEmailHTML, sendBatchEmails } from './integrations/sendgrid';
export {
  notifySlack,
  formatNewLeadSlack,
  formatSMSResponse,
  formatEmailResponse,
  formatDripEventSlack,
} from './integrations/slack';

// Utils
export {
  SMSAutomationError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  IntegrationError,
  getErrorResponse,
} from './utils/errors';

// Manifest
export { manifest } from './manifest';
export type { WidgetManifest } from './manifest';
