'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

interface SMSDashboardProps {
  primaryColor?: string;
  darkMode?: boolean;
  onLeadSelect?: (leadId: string) => void;
}

export function SMSDashboard({
  primaryColor = '#3b82f6',
  darkMode = false,
  onLeadSelect,
}: SMSDashboardProps): React.ReactNode {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const bgColor = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const borderColor = darkMode ? '#374151' : '#e5e7eb';

  // Load leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sms-automation/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSelect = async (lead: Lead) => {
    setSelectedLead(lead);
    onLeadSelect?.(lead.id);

    // Fetch conversation
    try {
      const response = await fetch(`/api/sms-automation/sms?leadId=${lead.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedLead || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/sms-automation/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          phone: selectedLead.phone,
          body: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      incoming: '#3b82f6',
      followed_up: '#8b5cf6',
      qualified: '#06b6d4',
      won: '#10b981',
      lost: '#ef4444',
      unsubscribed: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
        color: textColor,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Leads List */}
      <div
        style={{
          width: '300px',
          borderRight: `1px solid ${borderColor}`,
          overflowY: 'auto',
          backgroundColor: bgColor,
        }}
      >
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>
            Leads
          </h2>
          <button
            onClick={fetchLeads}
            style={{
              width: '100%',
              padding: '8px 16px',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            Refresh
          </button>
        </div>

        <div>
          {isLoading ? (
            <p style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
              Loading...
            </p>
          ) : leads.length === 0 ? (
            <p style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
              No leads yet
            </p>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleLeadSelect(lead)}
                style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${borderColor}`,
                  cursor: 'pointer',
                  backgroundColor:
                    selectedLead?.id === lead.id
                      ? darkMode
                        ? '#374151'
                        : '#f3f4f6'
                      : 'transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: '0 0 4px 0',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      {lead.name}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                      {lead.phone}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(lead.status),
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conversation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bgColor,
        }}
      >
        {selectedLead ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: '16px',
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700' }}>
                {selectedLead.name}
              </h2>
              <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                {selectedLead.phone}
              </p>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', margin: 'auto' }}>
                  No messages yet
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor:
                          msg.direction === 'outbound'
                            ? primaryColor
                            : darkMode
                              ? '#374151'
                              : '#e5e7eb',
                        color:
                          msg.direction === 'outbound' ? 'white' : textColor,
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      {msg.body}
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginTop: '4px',
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '16px',
                borderTop: `1px solid ${borderColor}`,
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSending) {
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  color: textColor,
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor:
                    isSending || !newMessage.trim() ? '#d1d5db' : primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
            }}
          >
            <p>Select a lead to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SMSDashboard;
