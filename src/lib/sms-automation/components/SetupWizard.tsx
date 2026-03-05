'use client';

import React, { useState } from 'react';

interface SetupWizardProps {
  onComplete?: () => void;
  primaryColor?: string;
}

type Step = 'password' | 'twilio' | 'sendgrid' | 'slack' | 'branding' | 'done';

const STEPS: { key: Step; label: string; optional?: boolean }[] = [
  { key: 'password', label: 'Admin Password' },
  { key: 'twilio', label: 'Twilio SMS' },
  { key: 'sendgrid', label: 'SendGrid Email' },
  { key: 'slack', label: 'Slack Notifications', optional: true },
  { key: 'branding', label: 'Branding', optional: true },
  { key: 'done', label: 'Complete' },
];

export function SetupWizard({
  onComplete,
  primaryColor = '#3b82f6',
}: SetupWizardProps): React.ReactNode {
  const [currentStep, setCurrentStep] = useState(0);
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    sendgridApiKey: '',
    sendgridFromEmail: '',
    sendgridReplyToEmail: '',
    slackWebhookUrl: '',
    companyName: '',
    primaryColor: '#3b82f6',
    logoUrl: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const saveSection = async (section: string, data: Record<string, unknown>) => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch('/api/sms-automation/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section, data }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save');
      }

      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 2000);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const step = STEPS[currentStep];

    switch (step.key) {
      case 'password': {
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        setIsSaving(true);
        setError('');
        try {
          const res = await fetch('/api/sms-automation/settings/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: formData.password }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Setup failed');
          }
          setToken(formData.password);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Setup failed');
          setIsSaving(false);
          return;
        }
        setIsSaving(false);
        break;
      }

      case 'twilio': {
        if (!formData.twilioAccountSid || !formData.twilioAuthToken || !formData.twilioPhoneNumber) {
          setError('All Twilio fields are required');
          return;
        }
        const saved = await saveSection('twilio', {
          accountSid: formData.twilioAccountSid,
          authToken: formData.twilioAuthToken,
          phoneNumber: formData.twilioPhoneNumber,
        });
        if (!saved) return;
        break;
      }

      case 'sendgrid': {
        if (!formData.sendgridApiKey || !formData.sendgridFromEmail) {
          setError('API Key and From Email are required');
          return;
        }
        const saved = await saveSection('sendgrid', {
          apiKey: formData.sendgridApiKey,
          fromEmail: formData.sendgridFromEmail,
          replyToEmail: formData.sendgridReplyToEmail || undefined,
        });
        if (!saved) return;
        break;
      }

      case 'slack': {
        if (formData.slackWebhookUrl) {
          const saved = await saveSection('slack', { webhookUrl: formData.slackWebhookUrl });
          if (!saved) return;
        }
        break;
      }

      case 'branding': {
        const saved = await saveSection('branding', {
          companyName: formData.companyName || 'My Company',
          primaryColor: formData.primaryColor,
          logoUrl: formData.logoUrl || undefined,
        });
        if (!saved) return;
        break;
      }

      case 'done':
        onComplete?.();
        return;
    }

    setCurrentStep((prev) => prev + 1);
    setError('');
    setSuccess('');
  };

  const handleSkip = () => {
    setCurrentStep((prev) => prev + 1);
    setError('');
    setSuccess('');
  };

  const step = STEPS[currentStep];

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

  const fieldStyle: React.CSSProperties = { marginBottom: '16px' };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
        {STEPS.map((s, i) => (
          <div key={s.key} style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: i <= currentStep ? primaryColor : '#e5e7eb',
            transition: 'background-color 0.3s',
          }} />
        ))}
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0', color: '#111827' }}>
        {step.key === 'done' ? 'Setup Complete!' : `Step ${currentStep + 1}: ${step.label}`}
      </h2>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
        {step.key === 'password' && 'Set a password to protect your settings.'}
        {step.key === 'twilio' && 'Enter your Twilio credentials for SMS.'}
        {step.key === 'sendgrid' && 'Enter your SendGrid credentials for email.'}
        {step.key === 'slack' && 'Optionally configure Slack notifications.'}
        {step.key === 'branding' && 'Customize the look of your widget.'}
        {step.key === 'done' && 'Your SMS Automation widget is ready to use.'}
      </p>

      {/* Password */}
      {step.key === 'password' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Admin Password *</label>
            <input type="password" value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Min 8 characters" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Confirm Password *</label>
            <input type="password" value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="Re-enter password" style={inputStyle} />
          </div>
        </>
      )}

      {/* Twilio */}
      {step.key === 'twilio' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Account SID *</label>
            <input type="text" value={formData.twilioAccountSid}
              onChange={(e) => updateField('twilioAccountSid', e.target.value)}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Auth Token *</label>
            <input type="password" value={formData.twilioAuthToken}
              onChange={(e) => updateField('twilioAuthToken', e.target.value)}
              placeholder="Your auth token" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone Number *</label>
            <input type="text" value={formData.twilioPhoneNumber}
              onChange={(e) => updateField('twilioPhoneNumber', e.target.value)}
              placeholder="+15551234567" style={inputStyle} />
          </div>
        </>
      )}

      {/* SendGrid */}
      {step.key === 'sendgrid' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>API Key *</label>
            <input type="password" value={formData.sendgridApiKey}
              onChange={(e) => updateField('sendgridApiKey', e.target.value)}
              placeholder="SG.xxxx" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>From Email *</label>
            <input type="email" value={formData.sendgridFromEmail}
              onChange={(e) => updateField('sendgridFromEmail', e.target.value)}
              placeholder="noreply@yourdomain.com" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Reply-To Email (optional)</label>
            <input type="email" value={formData.sendgridReplyToEmail}
              onChange={(e) => updateField('sendgridReplyToEmail', e.target.value)}
              placeholder="support@yourdomain.com" style={inputStyle} />
          </div>
        </>
      )}

      {/* Slack */}
      {step.key === 'slack' && (
        <div style={fieldStyle}>
          <label style={labelStyle}>Webhook URL (optional)</label>
          <input type="text" value={formData.slackWebhookUrl}
            onChange={(e) => updateField('slackWebhookUrl', e.target.value)}
            placeholder="https://hooks.slack.com/services/..." style={inputStyle} />
        </div>
      )}

      {/* Branding */}
      {step.key === 'branding' && (
        <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Company Name</label>
            <input type="text" value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="My Company" style={inputStyle} />
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
              placeholder="https://yourdomain.com/logo.png" style={inputStyle} />
          </div>
        </>
      )}

      {/* Error / Success */}
      {error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '10px 14px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
          {success}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleNext} disabled={isSaving} style={{
          flex: 1,
          padding: '10px 20px',
          backgroundColor: isSaving ? '#9ca3af' : primaryColor,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isSaving ? 'not-allowed' : 'pointer',
        }}>
          {isSaving ? 'Saving...' : step.key === 'done' ? 'Go to Dashboard' : 'Continue'}
        </button>
        {step.optional && (
          <button onClick={handleSkip} style={{
            padding: '10px 20px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

export default SetupWizard;
