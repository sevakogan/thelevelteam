"use client";

import { useState, useCallback } from "react";
import type { Lead, MessageLog } from "@/lib/marketing/types";
import { EmailIcon } from "./icons";

interface SendEmailProps {
  readonly leads: readonly Lead[];
  readonly onSend: (logs: readonly MessageLog[]) => void;
}

export function SendEmail({ leads, onSend }: SendEmailProps) {
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const emailLeads = leads.filter((l) => l.email_consent && l.email);

  const filteredLeads = searchQuery.trim()
    ? emailLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emailLeads;

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
    if (selectedLeadIds.size === 0 || !subject.trim() || !body.trim()) return;
    setSending(true);

    const now = new Date().toISOString();
    const logs: MessageLog[] = leads
      .filter((l) => selectedLeadIds.has(l.id))
      .map((l) => ({
        id: crypto.randomUUID(),
        lead_id: l.id,
        channel: "email" as const,
        to: l.email,
        subject: subject.trim(),
        body: body.trim(),
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
        setSubject("");
        setBody("");
        setSelectedLeadIds(new Set());
      }, 2000);
    }, 800);
  }, [selectedLeadIds, subject, body, leads, onSend]);

  return (
    <div className="space-y-4">
      {/* Compose area */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center gap-2">
          <EmailIcon className="w-4 h-4 text-accent-blue" />
          <span className="text-sm text-white font-medium">Compose Email</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Subject line */}
          <div>
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 mt-1.5 focus:border-accent-blue/60 outline-none placeholder:text-brand-muted/60"
              placeholder="Email subject line..."
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 mt-1.5 focus:border-accent-blue/60 outline-none resize-none placeholder:text-brand-muted/60 leading-relaxed"
              placeholder="Write your email content here..."
            />
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-brand-muted/80">
                {body.length} characters
              </span>
              <span className="text-[10px] text-brand-muted/60">
                Plain text · HTML templates coming soon
              </span>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
                Recipients ({selectedLeadIds.size} selected)
              </label>
              {emailLeads.length > 0 && (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-[10px] text-accent-blue hover:text-accent-blue/80 transition-colors"
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
              className="w-full text-xs text-white bg-transparent border border-brand-border rounded-lg px-3 py-1.5 mb-2 focus:border-accent-blue/60 outline-none placeholder:text-brand-muted/60"
              placeholder="Search leads by name, email, or company..."
            />

            {emailLeads.length === 0 ? (
              <p className="text-xs text-brand-muted py-4 text-center">
                No leads with email consent and email address.
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
                          ? "bg-accent-blue/10 border border-accent-blue/20"
                          : "hover:bg-brand-border/10 border border-transparent"
                      }`}
                    >
                      <RecipientCheckbox checked={isSelected} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-white font-medium">{lead.name}</span>
                        {lead.company && (
                          <span className="text-[10px] text-brand-muted ml-2">@ {lead.company}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-brand-muted shrink-0">{lead.email}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Send */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/30">
            <span className="text-[10px] text-brand-muted/80">
              {selectedLeadIds.size > 0 && subject.trim() && body.trim()
                ? `Will send ${selectedLeadIds.size} email${selectedLeadIds.size !== 1 ? "s" : ""}`
                : "Select recipients and compose an email"}
            </span>
            {sent ? (
              <div className="flex items-center gap-2 text-accent-blue">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium">Sent!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={selectedLeadIds.size === 0 || !subject.trim() || !body.trim() || sending}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
                  selectedLeadIds.size > 0 && subject.trim() && body.trim() && !sending
                    ? "text-white bg-accent-blue hover:bg-accent-blue/80"
                    : "text-brand-muted/60 bg-brand-border/30 cursor-not-allowed"
                }`}
              >
                <EmailIcon className="w-3.5 h-3.5" />
                {sending ? "Sending..." : `Send Email (${selectedLeadIds.size})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipientCheckbox({ checked }: { readonly checked: boolean }) {
  return (
    <div
      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked ? "bg-accent-blue border-accent-blue" : "border-brand-muted/40"
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
