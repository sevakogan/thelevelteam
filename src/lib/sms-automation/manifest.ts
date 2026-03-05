/**
 * SMS Automation Widget Manifest
 * Defines the widget's metadata and requirements
 */

export interface WidgetManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license?: string;
  requiredEnvVars: string[];
  requiredDatabaseTables: string[];
  apiRoutes: {
    path: string;
    methods: string[];
    description: string;
    protected?: boolean;
  }[];
  components: {
    name: string;
    path: string;
    description: string;
    type: 'page' | 'form' | 'widget' | 'hook';
  }[];
  hooks: {
    name: string;
    path: string;
    description: string;
  }[];
}

export const manifest: WidgetManifest = {
  name: '@seva-widgets/sms-automation',
  version: '1.0.0',
  description:
    '2-way SMS & email automation with drip campaigns, lead management, and conversation tracking',
  author: 'Seva Kogan',
  license: 'MIT',

  requiredEnvVars: [
    'DATABASE_URL',
  ],

  requiredDatabaseTables: [
    'leads',
    'drip_campaigns',
    'lead_drip_state',
    'sms_messages',
    'email_messages',
    'widget_settings',
  ],

  apiRoutes: [
    {
      path: '/api/sms-automation/leads',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      description: 'Manage leads (create, read, update, delete)',
    },
    {
      path: '/api/sms-automation/sms',
      methods: ['GET', 'POST'],
      description: 'SMS conversation history and sending',
    },
    {
      path: '/api/sms-automation/email',
      methods: ['GET', 'POST'],
      description: 'Email conversation history and sending',
    },
    {
      path: '/api/sms-automation/campaigns',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      description: 'Manage drip campaigns',
    },
    {
      path: '/api/sms-automation/drip/process',
      methods: ['POST', 'GET'],
      description: 'Process pending drip messages',
      protected: true,
    },
    {
      path: '/api/sms-automation/settings',
      methods: ['GET', 'PUT', 'POST'],
      description: 'Manage widget settings and test connections',
      protected: true,
    },
    {
      path: '/api/sms-automation/settings/setup',
      methods: ['GET', 'POST'],
      description: 'Initial setup status and password creation',
    },
  ],

  components: [
    {
      name: 'LeadCaptureForm',
      path: 'src/components/LeadCaptureForm.tsx',
      description: 'Public-facing form for lead capture with consent options',
      type: 'form',
    },
    {
      name: 'SMSDashboard',
      path: 'src/components/SMSDashboard.tsx',
      description: 'Admin dashboard for SMS conversations and lead management',
      type: 'page',
    },
    {
      name: 'CampaignManager',
      path: 'src/components/CampaignManager.tsx',
      description: 'UI for creating and managing drip campaigns',
      type: 'page',
    },
    {
      name: 'SetupWizard',
      path: 'src/components/SetupWizard.tsx',
      description: 'Step-by-step first-time setup wizard',
      type: 'page',
    },
    {
      name: 'SettingsPanel',
      path: 'src/components/SettingsPanel.tsx',
      description: 'Tabbed settings management UI',
      type: 'page',
    },
  ],

  hooks: [
    {
      name: 'useLeads',
      path: 'src/hooks/useLeads.ts',
      description: 'Manage leads with SWR data fetching',
    },
    {
      name: 'useSMSConversation',
      path: 'src/hooks/useSMS.ts',
      description: 'Manage SMS conversations and sending',
    },
    {
      name: 'useCampaigns',
      path: 'src/hooks/useCampaigns.ts',
      description: 'Manage drip campaigns',
    },
    {
      name: 'useNotifications',
      path: 'src/hooks/useNotifications.ts',
      description: 'Manage toast notifications',
    },
    {
      name: 'useSettings',
      path: 'src/hooks/useSettings.ts',
      description: 'Settings and setup status management with SWR',
    },
  ],
};

export default manifest;
