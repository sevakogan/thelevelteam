'use client';

import { useState, useEffect } from 'react';
import {
  SetupWizard,
  SMSDashboard,
  CampaignManager,
  SettingsPanel,
} from '@/lib/sms-automation/components';

type Tab = 'dashboard' | 'campaigns' | 'settings';

const TABS: { key: Tab; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'settings', label: 'Settings' },
];

export default function SMSWidgetPage() {
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [settingsToken, setSettingsToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    fetch('/api/sms-automation/settings/setup')
      .then((res) => res.json())
      .then((data) => setSetupCompleted(data.setupCompleted ?? false))
      .catch(() => setSetupCompleted(false));
  }, []);

  if (setupCompleted === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-brand-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (!setupCompleted) {
    return (
      <div className="py-4">
        <SetupWizard
          onComplete={() => setSetupCompleted(true)}
          primaryColor="#3b82f6"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">SMS Automation</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage SMS conversations, drip campaigns, and integration settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-separator">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'text-foreground border-accent-blue'
                : 'text-brand-muted border-transparent hover:text-foreground hover:border-brand-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div style={{ height: 'calc(100vh - 240px)', borderRadius: '12px', overflow: 'hidden' }}>
          <SMSDashboard darkMode primaryColor="#3b82f6" />
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <CampaignManager darkMode primaryColor="#3b82f6" />
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <>
          {settingsToken ? (
            <SettingsPanel
              token={settingsToken}
              primaryColor="#3b82f6"
              onClose={() => setSettingsToken('')}
            />
          ) : (
            <div className="max-w-md mx-auto mt-8 p-6 rounded-xl border border-separator bg-brand-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Enter Admin Password
              </h3>
              <p className="text-brand-muted text-sm mb-4">
                Enter the password you set during setup to access settings.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tokenInput) {
                      setSettingsToken(tokenInput);
                    }
                  }}
                  placeholder="Admin password"
                  className="flex-1 px-3 py-2 rounded-lg border border-separator bg-brand-dark text-foreground text-sm placeholder:text-brand-muted focus:outline-none focus:border-accent-blue"
                />
                <button
                  onClick={() => setSettingsToken(tokenInput)}
                  disabled={!tokenInput}
                  className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
