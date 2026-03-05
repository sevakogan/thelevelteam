'use client';

import React, { useState, useEffect } from 'react';

interface DripMessage {
  delayDays: number;
  subject?: string;
  body: string;
  type: 'sms' | 'email';
}

interface Campaign {
  id: string;
  name: string;
  channel: 'sms' | 'email' | 'both';
  messages: DripMessage[];
  isActive: boolean;
  createdAt: string;
}

interface CampaignManagerProps {
  primaryColor?: string;
  darkMode?: boolean;
}

export function CampaignManager({
  primaryColor = '#3b82f6',
  darkMode = false,
}: CampaignManagerProps): React.ReactNode {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'sms' as 'sms' | 'email' | 'both',
    messages: [{ delayDays: 0, subject: '', body: '', type: 'sms' as 'sms' | 'email' }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const borderColor = darkMode ? '#374151' : '#e5e7eb';

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sms-automation/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = () => {
    setFormData((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          delayDays: (prev.messages[prev.messages.length - 1]?.delayDays || 0) + 1,
          subject: '',
          body: '',
          type: prev.channel === 'sms' ? 'sms' : 'email',
        },
      ],
    }));
  };

  const handleRemoveMessage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index),
    }));
  };

  const handleMessageChange = (
    index: number,
    field: keyof DripMessage,
    value: any
  ) => {
    setFormData((prev) => {
      const newMessages = [...prev.messages];
      newMessages[index] = { ...newMessages[index], [field]: value };
      return { ...prev, messages: newMessages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name.trim()) {
      setErrors({ name: 'Campaign name is required' });
      return;
    }

    if (formData.messages.some((m) => !m.body.trim())) {
      setErrors({ messages: 'All messages must have content' });
      return;
    }

    try {
      const url = editingId
        ? `/api/sms-automation/campaigns?id=${editingId}`
        : '/api/sms-automation/campaigns';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCampaigns();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: '',
          channel: 'sms',
          messages: [{ delayDays: 0, subject: '', body: '', type: 'sms' }],
        });
      }
    } catch (error) {
      console.error('Failed to save campaign:', error);
      setErrors({ general: 'Failed to save campaign' });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/sms-automation/campaigns?id=${id}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Failed to toggle campaign:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
        color: textColor,
        padding: '32px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Drip Campaigns
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                channel: 'sms',
                messages: [{ delayDays: 0, subject: '', body: '', type: 'sms' }],
              });
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Cancel' : 'New Campaign'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div
            style={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
              {editingId ? 'Edit Campaign' : 'Create Campaign'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Campaign Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Welcome Series"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                />
                {errors.name && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Channel */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
                  Channel *
                </label>
                <select
                  value={formData.channel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      channel: e.target.value as 'sms' | 'email' | 'both',
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    color: textColor,
                  }}
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="both">Both SMS & Email</option>
                </select>
              </div>

              {/* Messages */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>
                  Messages *
                </label>
                {formData.messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                        Step {index + 1}
                      </h4>
                      {formData.messages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(index)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                          Delay (days)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={msg.delayDays}
                          onChange={(e) =>
                            handleMessageChange(index, 'delayDays', parseInt(e.target.value))
                          }
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            color: textColor,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                          Type
                        </label>
                        <select
                          value={msg.type}
                          onChange={(e) =>
                            handleMessageChange(index, 'type', e.target.value as 'sms' | 'email')
                          }
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            color: textColor,
                            boxSizing: 'border-box',
                          }}
                        >
                          <option value="sms">SMS</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>

                    {msg.type === 'email' && (
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                          Subject
                        </label>
                        <input
                          type="text"
                          value={msg.subject || ''}
                          onChange={(e) => handleMessageChange(index, 'subject', e.target.value)}
                          placeholder="Email subject"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${borderColor}`,
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            color: textColor,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                        Message
                      </label>
                      <textarea
                        value={msg.body}
                        onChange={(e) => handleMessageChange(index, 'body', e.target.value)}
                        placeholder="Message content..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          color: textColor,
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                          resize: 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddMessage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Add Message
                </button>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Save Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#d1d5db',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns List */}
        <div>
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
          ) : campaigns.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              No campaigns yet. Create one to get started!
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                      {campaign.name}
                    </h3>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: campaign.isActive ? '#d1fae5' : '#fee2e2',
                        color: campaign.isActive ? '#065f46' : '#991b1b',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {campaign.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>
                    Channel: {campaign.channel}
                  </p>

                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>
                    Steps: {campaign.messages.length}
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleActive(campaign.id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: campaign.isActive ? '#fca5a5' : '#86efac',
                        color: '#1f2937',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {campaign.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(campaign.id);
                        setFormData({
                          name: campaign.name,
                          channel: campaign.channel,
                          messages: campaign.messages.map((m) => ({
                            ...m,
                            subject: m.subject ?? '',
                          })),
                        });
                        setShowForm(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: primaryColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignManager;
