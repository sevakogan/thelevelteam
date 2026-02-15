"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Lead, MessageLog } from "@/lib/marketing/types";
import { SmsIcon, EmailIcon } from "./icons";

interface LeadConversationProps {
  readonly lead: Lead | null;
  readonly messageLogs: readonly MessageLog[];
  readonly onSend: (logs: readonly MessageLog[]) => void;
}

type ConvoTab = "sms" | "email";

export function LeadConversation({ lead, messageLogs, onSend }: LeadConversationProps) {
  const [activeTab, setActiveTab] = useState<ConvoTab>("sms");
  const [smsText, setSmsText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const leadLogs = lead
    ? messageLogs.filter((m) => m.lead_id === lead.id)
    : [];

  const smsLogs = leadLogs.filter((m) => m.channel === "sms");
  const emailLogs = leadLogs.filter((m) => m.channel === "email");
  const activeLogs = activeTab === "sms" ? smsLogs : emailLogs;

  const sorted = [...activeLogs].sort(
    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sorted.length, activeTab]);

  // Switch to SMS tab if lead has phone, else email
  useEffect(() => {
    if (!lead) return;
    if (lead.phone && lead.sms_consent) {
      setActiveTab("sms");
    } else if (lead.email && lead.email_consent) {
      setActiveTab("email");
    }
  }, [lead]);

  const canSendSms = lead?.phone && lead.sms_consent;
  const canSendEmail = lead?.email && lead.email_consent;

  const handleSendSms = useCallback(() => {
    if (!lead || !smsText.trim() || !canSendSms) return;
    setSending(true);

    const log: MessageLog = {
      id: crypto.randomUUID(),
      lead_id: lead.id,
      channel: "sms",
      to: lead.phone,
      body: smsText.trim(),
      status: "sent",
      sent_at: new Date().toISOString(),
    };

    // Simulate send delay
    setTimeout(() => {
      onSend([log]);
      setSmsText("");
      setSending(false);

      // Simulate incoming reply after 2s
      setTimeout(() => {
        const reply: MessageLog = {
          id: crypto.randomUUID(),
          lead_id: lead.id,
          channel: "sms",
          to: "you",
          body: getSimulatedReply(),
          status: "delivered",
          sent_at: new Date().toISOString(),
        };
        onSend([reply]);
      }, 2000);
    }, 600);
  }, [lead, smsText, canSendSms, onSend]);

  const handleSendEmail = useCallback(() => {
    if (!lead || !emailSubject.trim() || !emailBody.trim() || !canSendEmail) return;
    setSending(true);

    const log: MessageLog = {
      id: crypto.randomUUID(),
      lead_id: lead.id,
      channel: "email",
      to: lead.email,
      subject: emailSubject.trim(),
      body: emailBody.trim(),
      status: "sent",
      sent_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onSend([log]);
      setEmailSubject("");
      setEmailBody("");
      setSending(false);
    }, 600);
  }, [lead, emailSubject, emailBody, canSendEmail, onSend]);

  if (!lead) {
    return (
      <div className="border border-brand-border rounded-xl flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center px-6">
          <div className="w-10 h-10 rounded-full bg-brand-border/20 flex items-center justify-center mx-auto mb-3">
            <SmsIcon className="w-5 h-5 text-brand-muted/40" />
          </div>
          <p className="text-sm text-brand-muted">Select a lead to start a conversation</p>
          <p className="text-xs text-brand-muted/40 mt-1">Click on any lead from the list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden flex flex-col h-full min-h-[400px]">
      {/* Header — lead info + channel tabs */}
      <div className="px-4 py-2.5 border-b border-brand-border bg-brand-border/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-accent-blue">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{lead.name}</p>
              <p className="text-[10px] text-brand-muted truncate">
                {activeTab === "sms" ? lead.phone : lead.email}
              </p>
            </div>
          </div>

          {/* Channel tabs */}
          <div className="flex items-center gap-1">
            {canSendSms && (
              <ChannelTab
                channel="sms"
                active={activeTab === "sms"}
                count={smsLogs.length}
                onClick={() => setActiveTab("sms")}
              />
            )}
            {canSendEmail && (
              <ChannelTab
                channel="email"
                active={activeTab === "email"}
                count={emailLogs.length}
                onClick={() => setActiveTab("email")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[#080a0f]">
        {sorted.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-brand-muted/40">
              No {activeTab === "sms" ? "SMS" : "email"} messages yet
            </p>
            <p className="text-[10px] text-brand-muted/30 mt-1">
              Send the first message below
            </p>
          </div>
        )}
        {sorted.map((msg) => {
          const isOutbound = msg.to !== "you";
          return (
            <MessageBubble key={msg.id} message={msg} outbound={isOutbound} />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose area */}
      {activeTab === "sms" ? (
        <SmsCompose
          value={smsText}
          onChange={setSmsText}
          onSend={handleSendSms}
          sending={sending}
          disabled={!canSendSms}
        />
      ) : (
        <EmailCompose
          subject={emailSubject}
          body={emailBody}
          onSubjectChange={setEmailSubject}
          onBodyChange={setEmailBody}
          onSend={handleSendEmail}
          sending={sending}
          disabled={!canSendEmail}
        />
      )}
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({
  message,
  outbound,
}: {
  readonly message: MessageLog;
  readonly outbound: boolean;
}) {
  const isSms = message.channel === "sms";
  const time = formatTime(message.sent_at);

  return (
    <div className={`flex ${outbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 ${
          outbound
            ? isSms
              ? "bg-green-600/20 border border-green-500/20"
              : "bg-accent-blue/20 border border-accent-blue/20"
            : "bg-brand-border/20 border border-brand-border/40"
        }`}
      >
        {message.subject && (
          <p className={`text-[11px] font-semibold mb-0.5 ${
            outbound ? "text-white" : "text-white"
          }`}>
            {message.subject}
          </p>
        )}
        <p className={`text-xs leading-relaxed ${
          outbound ? "text-white/90" : "text-brand-muted"
        }`}>
          {message.body}
        </p>
        <div className={`flex items-center gap-1.5 mt-1 ${
          outbound ? "justify-end" : "justify-start"
        }`}>
          <span className="text-[9px] text-brand-muted/40">{time}</span>
          {outbound && (
            <StatusDot status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SMS Compose ─────────────────────────────────────────────────────────────

function SmsCompose({
  value,
  onChange,
  onSend,
  sending,
  disabled,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly onSend: () => void;
  readonly sending: boolean;
  readonly disabled: boolean;
}) {
  const charCount = value.length;
  const segmentCount = charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  return (
    <div className="border-t border-brand-border bg-brand-border/5 px-3 py-2.5">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={2}
            disabled={disabled}
            className="w-full text-xs text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 focus:border-green-400/60 outline-none resize-none placeholder:text-brand-muted/40 disabled:opacity-40"
            placeholder={disabled ? "SMS not available" : "Type a message... (Enter to send)"}
          />
          {charCount > 0 && (
            <span className="text-[9px] text-brand-muted/40 mt-0.5 block">
              {charCount}/160 · {segmentCount} seg
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || sending || disabled}
          className="shrink-0 w-8 h-8 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-brand-border/30 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-0.5"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-4 4m4-4l4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Email Compose ───────────────────────────────────────────────────────────

function EmailCompose({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  onSend,
  sending,
  disabled,
}: {
  readonly subject: string;
  readonly body: string;
  readonly onSubjectChange: (v: string) => void;
  readonly onBodyChange: (v: string) => void;
  readonly onSend: () => void;
  readonly sending: boolean;
  readonly disabled: boolean;
}) {
  return (
    <div className="border-t border-brand-border bg-brand-border/5 px-3 py-2.5 space-y-1.5">
      <input
        type="text"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        disabled={disabled}
        className="w-full text-xs text-white bg-transparent border border-brand-border rounded-lg px-3 py-1.5 focus:border-accent-blue/60 outline-none placeholder:text-brand-muted/40 disabled:opacity-40"
        placeholder={disabled ? "Email not available" : "Subject..."}
      />
      <div className="flex items-end gap-2">
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          rows={3}
          disabled={disabled}
          className="flex-1 text-xs text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 focus:border-accent-blue/60 outline-none resize-none placeholder:text-brand-muted/40 disabled:opacity-40"
          placeholder="Write your email..."
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!subject.trim() || !body.trim() || sending || disabled}
          className="shrink-0 w-8 h-8 rounded-lg bg-accent-blue hover:bg-accent-blue/80 disabled:bg-brand-border/30 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-0.5"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-4 4m4-4l4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Channel Tab ─────────────────────────────────────────────────────────────

function ChannelTab({
  channel,
  active,
  count,
  onClick,
}: {
  readonly channel: ConvoTab;
  readonly active: boolean;
  readonly count: number;
  readonly onClick: () => void;
}) {
  const isSms = channel === "sms";
  const activeStyle = isSms
    ? "bg-green-500/15 text-green-400 border-green-500/30"
    : "bg-accent-blue/15 text-accent-blue border-accent-blue/30";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
        active ? activeStyle : "text-brand-muted/50 border-brand-border/30 hover:border-brand-muted/40"
      }`}
    >
      {isSms ? <SmsIcon className="w-3 h-3" /> : <EmailIcon className="w-3 h-3" />}
      {isSms ? "SMS" : "Email"}
      {count > 0 && <span className="ml-0.5">{count}</span>}
    </button>
  );
}

// ─── Status Dot ──────────────────────────────────────────────────────────────

function StatusDot({ status }: { readonly status: string }) {
  const colors: Record<string, string> = {
    sent: "bg-yellow-400",
    delivered: "bg-green-400",
    failed: "bg-red-400",
    bounced: "bg-orange-400",
  };
  return (
    <div className={`w-1.5 h-1.5 rounded-full ${colors[status] ?? colors.sent}`} title={status} />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getSimulatedReply(): string {
  const replies = [
    "Thanks for reaching out! Let me think about it.",
    "Sounds good, when can we schedule a call?",
    "I'm interested! Can you send more details?",
    "Got it, I'll get back to you soon.",
    "Thanks! What are the next steps?",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
