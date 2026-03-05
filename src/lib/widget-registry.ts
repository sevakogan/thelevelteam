export interface WidgetEntry {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly icon: 'sms' | 'email' | 'analytics' | 'crm' | 'calendar' | 'payments';
  readonly color: string;
  readonly dashboardPath: string;
  readonly installed: boolean;
  readonly features: readonly string[];
}

export const widgetRegistry: readonly WidgetEntry[] = [
  {
    slug: 'sms-automation',
    name: 'SMS Automation',
    description: '2-way SMS & email automation with drip campaigns, lead management, and conversation tracking.',
    icon: 'sms',
    color: '#3B82F6',
    dashboardPath: '/dashboard/sms-widget',
    installed: true,
    features: [
      'Lead capture & management',
      'SMS & email conversations',
      'Drip campaign builder',
      'Twilio & SendGrid integration',
      'In-app setup wizard',
    ],
  },
];

export function getWidget(slug: string): WidgetEntry | undefined {
  return widgetRegistry.find((w) => w.slug === slug);
}

export function getInstalledWidgets(): readonly WidgetEntry[] {
  return widgetRegistry.filter((w) => w.installed);
}
