"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PencilIcon } from "./icons";

const DEFAULT_DISCLAIMER =
  "By submitting your info, you agree to receive marketing messages (SMS & email) from our team. " +
  "Message frequency varies. Msg & data rates may apply. Reply STOP to opt out of texts at any time. " +
  "Unsubscribe from emails via the link in each message. We respect your privacy and will never sell your data.";

const COMPLIANCE_ITEMS: readonly { label: string; description: string }[] = [
  {
    label: "TCPA (SMS)",
    description: "All SMS recipients must give prior express written consent. Every first message includes opt-out instructions (STOP). Suppression lists are honored immediately.",
  },
  {
    label: "CAN-SPAM (Email)",
    description: "All marketing emails include a valid physical address, clear sender identification, and a working unsubscribe link. Opt-outs are processed within 10 business days.",
  },
  {
    label: "GDPR (If applicable)",
    description: "Data collected is limited to what's necessary. Users may request access, correction, or deletion of their data at any time by contacting the account owner.",
  },
];

export function ComplianceNotice() {
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const handleSave = useCallback(() => {
    setEditing(false);
  }, []);

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm text-white font-medium">Legal &amp; Compliance</span>
          <span className="text-[10px] px-1.5 py-0 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 font-medium">
            Required
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-brand-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Editable disclaimer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Your Consent Disclaimer
              </h4>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-[11px] text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-brand-muted leading-relaxed bg-transparent border border-accent-blue/30 rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none"
                  placeholder="Enter your legal disclaimer..."
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setDisclaimer(DEFAULT_DISCLAIMER); setEditing(false); }}
                    className="text-[11px] text-brand-muted hover:text-white transition-colors"
                  >
                    Reset to default
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="text-[11px] font-medium text-accent-blue hover:text-accent-purple transition-colors px-3 py-1 rounded-md border border-brand-border hover:border-accent-blue/40"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-brand-border bg-brand-border/5 px-3 py-2">
                <p className="text-xs text-brand-muted leading-relaxed">{disclaimer}</p>
              </div>
            )}

            <p className="text-[10px] text-brand-muted/60 mt-1.5">
              This text is shown to users on the lead capture form before they submit.
            </p>
          </div>

          {/* Compliance checklist */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Compliance Checklist
            </h4>
            <div className="space-y-2">
              {COMPLIANCE_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 rounded-lg border border-brand-border/50 px-3 py-2"
                >
                  <svg className="w-4 h-4 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-xs font-medium text-white">{item.label}</span>
                    <p className="text-[10px] text-brand-muted leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
