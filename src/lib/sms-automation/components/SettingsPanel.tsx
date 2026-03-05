'use client';

import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  token: string;
  primaryColor?: string;
  onClose?: () => void;
}

type Tab = 'twilio' | 'sendgrid' | 'slack' | 'security' | 'branding';

const TABS: { key: Tab; label: string }[] = [
  { key: 'twilio', label: 'Twilio SMS' },
  { key: 'sendgrid', label: 'SendGrid Email' },
  { key: 'slack', label: 'Slack' },
  { key: 'security', label: 'Security' },
  { key: 'branding', label: 'Branding' },
];

interface SettingsData {
  twilioAccountSid: string;
  twilioPhoneNumber: string;
  sendgridFromEmail: string;
  sendgridReplyToEmail: string;
  slackWebhookUrl: string;
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  portfolioUrl: string;
  caseStudyUrl: string;
  bookingUrl: string;
  setupCompleted: boolean;
}

export function SettingsPanel({
  token,
  primaryColor = '#3b82f6',
  onClose,
}: SettingsPanelProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<Tab>('twilio');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    sendgridApiKey: '',
    sendgridFromEmail: '',
    sendgridReplyToEmail: '',
    slackWebhookUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    cronSecret: '',
    companyName: '',
    primaryColor: '#3b82f6',
    logoUrl: '',
    portfolioUrl: '',
    caseStudyUrl: '',
    bookingUrl: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sms-automation/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      setSettings(data);
      setFormData((prev) => ({
        ...prev,
        twilioAccountSid: data.twilioAccountSid || '',
        twilioPhoneNumber: data.twilioPhoneNumber || '',
        sendgridFromEmail: data.sendgridFromEmail || '',
        sendgridReplyToEmail: data.sendgridReplyToEmail || '',
        slackWebhookUrl: data.slackWebhookUrl || '',
        companyName: data.companyName || '',
        primaryColor: data.primaryColor || '#3b82f6',
        logoUrl: data.logoUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        caseStudyUrl: data.caseStudyUrl || '',
        bookingUrl: data.bookingUrl || '',
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setTestResult(null);
  };

  const saveSection = async (section: string, data: Record<string, unknown>) => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/sms-automation/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await loadSettings();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (service: string) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/sms-automation/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: `test-${service}` }),
      });
      const data = await res.json();
      setTestResult({
        type: res.ok ? 'success' : 'error',
        message: data.message || data.error || (res.ok ? 'Connection successful!' : 'Connection failed'),
      });
    } catch (e) {
      setTestResult({
        type: 'error',
        message: e instanceof Error ? e.message : 'Test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    switch (activeTab) {
      case 'twilio': {
        const data: Record<string, unknown> = {
          phoneNumber: formData.twilioPhoneNumber,
        };
        if (formData.twilioAccountSid) data.accountSid = formData.twilioAccountSid;
        if (formData.twilioAuthToken) data.authToken = formData.twilioAuthToken;
        await saveSection('twilio', data);
        break;
      }
      case 'sendgrid': {
        const data: Record<string, unknown> = {
          fromEmail: formData.sendgridFromEmail,
          replyToEmail: formData.sendgridReplyToEmail || undefined,
        };
        if (formData.sendgridApiKey) data.apiKey = formData.sendgridApiKey;
        await saveSection('sendgrid', data);
        break;
      }
      case 'slack':
        await saveSection('slack', { webhookUrl: formData.slackWebhookUrl || undefined });
        break;
      case 'security': {
        if (formData.newPassword) {
          if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
          }
          if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
        }
        const data: Record<string, unknown> = {};
        if (formData.newPassword) data.password = formData.newPassword;
        if (formData.cronSecret) data.cronSecret = formData.cronSecret;
        if (Object.keys(data).length === 0) {
          setError('No changes to save');
          return;
        }
        const saved = await saveSection('security', data);
        if (saved) {
          setFormData((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            cronSecret: '',
          }));
        }
        break;
      }
      case 'branding':
        await saveSection('branding', {
          companyName: formData.companyName || 'My Company',
          primaryColor: formData.primaryColor,
          logoUrl: formData.logoUrl || undefined,
          portfolioUrl: formData.portfolioUrl || undefined,
          caseStudyUrl: formData.caseStudyUrl || undefined,
          bookingUrl: formData.bookingUrl || undefined,
        });
        break;
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#374151',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  };

  const fieldStyle: React.CSSProperties = { marginBottom: '16px' };

  if (isLoading) {
    return (
      <div style={{
        maxWidth: '640px',
        margin: '40px auto',
        padding: '32px',
        textAlign: 'center',
        color: '#6b7280',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '640px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0', color: '#111827' }}>
          Settings
        </h2>
        {onClose && (
          <button onClick={onClose} style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            Close
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        marginBottom: '24px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '3px',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(''); setSuccess(''); setTestResult(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? '600' : '400',
              backgroundColor: activeTab === tab.key ? '#ffffff' : 'transparent',
              color: activeTab === tab.key ? '#111827' : '#6b7280',
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Twilio Tab */}
      {activeTab === 'twilio' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Account SID</label>
            <input type="text" value={formData.twilioAccountSid}
              onChange={(e) => updateField('twilioAccountSid', e.target.value)}
              placeholder={settings?.twilioAccountSid ? '(configured - leave blank to keep)' : 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
              style={inputStyle} />
            {settings?.twilioAccountSid && (
              <p style={hintStyle}>Current: {settings.twilioAccountSid}</p>
            )}
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Auth Token</label>
            <input type="password" value={formData.twilioAuthToken}
              onChange={(e) => updateField('twilioAuthToken', e.target.value)}
              placeholder="Leave blank to keep current value"
              style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input type="text" value={formData.twilioPhoneNumber}
              onChange={(e) => updateField('twilioPhoneNumber', e.target.value)}
              placeholder="+15551234567"
              style={inputStyle} />
          </div>
          <button onClick={() => testConnection('twilio')} disabled={isTesting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: isTesting ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </>
      )}

      {/* SendGrid Tab */}
      {activeTab === 'sendgrid' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>API Key</label>
            <input type="password" value={formData.sendgridApiKey}
              onChange={(e) => updateField('sendgridApiKey', e.target.value)}
              placeholder="Leave blank to keep current value"
              style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>From Email</label>
            <input type="email" value={formData.sendgridFromEmail}
              onChange={(e) => updateField('sendgridFromEmail', e.target.value)}
              placeholder="noreply@yourdomain.com"
              style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Reply-To Email (optional)</label>
            <input type="email" value={formData.sendgridReplyToEmail}
              onChange={(e) => updateField('sendgridReplyToEmail', e.target.value)}
              placeholder="support@yourdomain.com"
              style={inputStyle} />
          </div>
          <button onClick={() => testConnection('sendgrid')} disabled={isTesting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: isTesting ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </>
      )}

      {/* Slack Tab */}
      {activeTab === 'slack' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Webhook URL</label>
            <input type="text" value={formData.slackWebhookUrl}
              onChange={(e) => updateField('slackWebhookUrl', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              style={inputStyle} />
            <p style={hintStyle}>Leave blank to disable Slack notifications.</p>
          </div>
          <button onClick={() => testConnection('slack')} disabled={isTesting || !formData.slackWebhookUrl}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: (isTesting || !formData.slackWebhookUrl) ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              opacity: !formData.slackWebhookUrl ? 0.5 : 1,
            }}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#111827' }}>
            Change Password
          </h3>
          <div style={fieldStyle}>
            <label style={labelStyle}>New Password</label>
            <input type="password" value={formData.newPassword}
              onChange={(e) => updateField('newPassword', e.target.value)}
              placeholder="Min 8 characters"
              style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              style={inputStyle} />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#111827' }}>
            Cron Secret
          </h3>
          <div style={fieldStyle}>
            <label style={labelStyle}>Secret Token</label>
            <input type="password" value={formData.cronSecret}
              onChange={(e) => updateField('cronSecret', e.target.value)}
              placeholder="Leave blank to keep current value"
              style={inputStyle} />
            <p style={hintStyle}>
              Used to authenticate the drip processor endpoint (POST /api/sms-automation/drip/process).
            </p>
          </div>
        </>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Company Name</label>
            <input type="text" value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="My Company"
              style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Primary Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={formData.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer' }} />
              <input type="text" value={formData.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Logo URL (optional)</label>
            <input type="text" value={formData.logoUrl}
              onChange={(e) => updateField('logoUrl', e.target.value)}
              placeholder="https://yourdomain.com/logo.png"
              style={inputStyle} />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#111827' }}>
            Template URLs
          </h3>
          <div style={fieldStyle}>
            <label style={labelStyle}>Portfolio URL</label>
            <input type="text" value={formData.portfolioUrl}
              onChange={(e) => updateField('portfolioUrl', e.target.value)}
              placeholder="https://yourdomain.com/portfolio"
              style={inputStyle} />
            <p style={hintStyle}>Used in SMS/email templates as {'{{portfolioUrl}}'}</p>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Case Study URL</label>
            <input type="text" value={formData.caseStudyUrl}
              onChange={(e) => updateField('caseStudyUrl', e.target.value)}
              placeholder="https://yourdomain.com/case-studies"
              style={inputStyle} />
            <p style={hintStyle}>Used in SMS/email templates as {'{{caseStudyUrl}}'}</p>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Booking URL</label>
            <input type="text" value={formData.bookingUrl}
              onChange={(e) => updateField('bookingUrl', e.target.value)}
              placeholder="https://yourdomain.com/book"
              style={inputStyle} />
            <p style={hintStyle}>Used in SMS/email templates as {'{{bookingUrl}}'}</p>
          </div>
        </>
      )}

      {/* Test Result */}
      {testResult && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: testResult.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: testResult.type === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          {testResult.message}
        </div>
      )}

      {/* Error / Success */}
      {error && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          {success}
        </div>
      )}

      {/* Save Button */}
      <button onClick={handleSave} disabled={isSaving} style={{
        width: '100%',
        padding: '10px 20px',
        backgroundColor: isSaving ? '#9ca3af' : primaryColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: isSaving ? 'not-allowed' : 'pointer',
      }}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

export default SettingsPanel;
