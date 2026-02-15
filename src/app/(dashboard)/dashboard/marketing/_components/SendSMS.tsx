"use client";

import { useState, useCallback } from "react";
import type { Lead, MessageLog } from "@/lib/marketing/types";
import { SmsIcon } from "./icons";

interface SendSMSProps {
  readonly leads: readonly Lead[];
  readonly onSend: (logs: readonly MessageLog[]) => void;
}

export function SendSMS({ leads, onSend }: SendSMSProps) {
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(new Set());
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const smsLeads = leads.filter((l) => l.sms_consent && l.phone);

  const filteredLeads = searchQuery.trim()
    ? smsLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.phone.includes(searchQuery) ||
          (l.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : smsLeads;

  const toggleLead = useCallback((id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedLeadIds((prev) => {
      if (prev.size === filteredLeads.length) return new Set();
      return new Set(filteredLeads.map((l) => l.id));
    });
  }, [filteredLeads]);

  const handleSend = useCallback(() => {
    if (selectedLeadIds.size === 0 || !message.trim()) return;
    setSending(true);

    const now = new Date().toISOString();
    const logs: MessageLog[] = leads
      .filter((l) => selectedLeadIds.has(l.id))
      .map((l) => ({
        id: crypto.randomUUID(),
        lead_id: l.id,
        channel: "sms" as const,
        to: l.phone,
        body: message.trim(),
        status: "sent" as const,
        sent_at: now,
      }));

    // Simulate send delay
    setTimeout(() => {
      onSend(logs);
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage("");
        setSelectedLeadIds(new Set());
      }, 2000);
    }, 800);
  }, [selectedLeadIds, message, leads, onSend]);

  const charCount = message.length;
  const segmentCount = charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  return (
    <div className="space-y-4">
      {/* Compose area */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center gap-2">
          <SmsIcon className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white font-medium">Compose SMS</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Message input */}
          <div>
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 mt-1.5 focus:border-green-400/60 outline-none resize-none placeholder:text-brand-muted/40"
              placeholder="Type your SMS message..."
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-brand-muted/60">
                {charCount} characters · {segmentCount} segment{segmentCount !== 1 ? "s" : ""}
              </span>
              {charCount > 160 && (
                <span className="text-[10px] text-yellow-400">
                  Multi-segment: counts as {segmentCount} messages per recipient
                </span>
              )}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
                Recipients ({selectedLeadIds.size} selected)
              </label>
              {smsLeads.length > 0 && (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-[10px] text-green-400 hover:text-green-300 transition-colors"
                >
                  {selectedLeadIds.size === filteredLeads.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-white bg-transparent border border-brand-border rounded-lg px-3 py-1.5 mb-2 focus:border-green-400/60 outline-none placeholder:text-brand-muted/40"
              placeholder="Search leads by name, phone, or company..."
            />

            {smsLeads.length === 0 ? (
              <p className="text-xs text-brand-muted py-4 text-center">
                No leads with SMS consent and phone number.
              </p>
            ) : (
              <div className="max-h-[200px] overflow-y-auto space-y-1 border border-brand-border/30 rounded-lg p-1.5">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.has(lead.id);
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => toggleLead(lead.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-green-500/10 border border-green-500/20"
                          : "hover:bg-brand-border/10 border border-transparent"
                      }`}
                    >
                      <RecipientCheckbox checked={isSelected} color="green" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-white font-medium">{lead.name}</span>
                        {lead.company && (
                          <span className="text-[10px] text-brand-muted ml-2">@ {lead.company}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-brand-muted shrink-0">{lead.phone}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Send */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/30">
            <span className="text-[10px] text-brand-muted/60">
              {selectedLeadIds.size > 0 && message.trim()
                ? `Will send ${segmentCount * selectedLeadIds.size} total segment${segmentCount * selectedLeadIds.size !== 1 ? "s" : ""}`
                : "Select recipients and compose a message"}
            </span>
            {sent ? (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium">Sent!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={selectedLeadIds.size === 0 || !message.trim() || sending}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
                  selectedLeadIds.size > 0 && message.trim() && !sending
                    ? "text-white bg-green-600 hover:bg-green-500"
                    : "text-brand-muted/40 bg-brand-border/30 cursor-not-allowed"
                }`}
              >
                <SmsIcon className="w-3.5 h-3.5" />
                {sending ? "Sending..." : `Send SMS (${selectedLeadIds.size})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipientCheckbox({ checked, color }: { readonly checked: boolean; readonly color: "green" | "blue" }) {
  const activeClass = color === "green" ? "bg-green-500 border-green-500" : "bg-accent-blue border-accent-blue";
  return (
    <div
      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked ? activeClass : "border-brand-muted/40"
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}
