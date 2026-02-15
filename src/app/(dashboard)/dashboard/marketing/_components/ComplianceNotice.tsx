"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PencilIcon } from "./icons";

// ─── SMS consent must contain these per TCPA / 10DLC / CTIA requirements ─────
// 1. Brand name
// 2. What messages they'll receive
// 3. Message frequency
// 4. "Msg & data rates may apply"
// 5. Reply STOP to opt out
// 6. Reply HELP for help
// 7. Link to privacy policy & terms

const DEFAULT_SMS_CONSENT =
  "TheLevel Team: You agree to receive recurring automated marketing text messages " +
  "at the number provided. Consent is not a condition of purchase. " +
  "Message frequency varies. Msg & data rates may apply. " +
  "Reply STOP to cancel. Reply HELP for help. " +
  "Privacy: thelevelteam.com/privacy | Terms: thelevelteam.com/terms";

const SMS_CONSENT_REQUIREMENTS: readonly { keywords: readonly string[]; label: string; hint: string }[] = [
  { keywords: ["level", "team", "company", "brand", "llc", "inc"], label: "Brand Name", hint: "Must include your company/brand name" },
  { keywords: ["recurring", "automated", "marketing"], label: "Message Type", hint: "Describe what messages they'll receive (e.g. 'recurring automated marketing text messages')" },
  { keywords: ["frequency"], label: "Frequency Disclosure", hint: "State how often (e.g. 'Message frequency varies')" },
  { keywords: ["rates", "data rates"], label: "Rates Notice", hint: "Include 'Msg & data rates may apply'" },
  { keywords: ["stop"], label: "STOP Keyword", hint: "Must include 'Reply STOP to cancel' or similar" },
  { keywords: ["help"], label: "HELP Keyword", hint: "Must include 'Reply HELP for help'" },
  { keywords: ["privacy", "terms"], label: "Privacy / Terms Links", hint: "Link to your privacy policy and/or terms of service" },
];

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

function checkRequirement(text: string, keywords: readonly string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function ComplianceNotice() {
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [editingDisclaimer, setEditingDisclaimer] = useState(false);
  const [smsConsent, setSmsConsent] = useState(DEFAULT_SMS_CONSENT);
  const [editingSmsConsent, setEditingSmsConsent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const disclaimerRef = useRef<HTMLTextAreaElement>(null);
  const smsConsentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingDisclaimer) disclaimerRef.current?.focus();
  }, [editingDisclaimer]);

  useEffect(() => {
    if (editingSmsConsent) smsConsentRef.current?.focus();
  }, [editingSmsConsent]);

  const passedChecks = SMS_CONSENT_REQUIREMENTS.filter((r) =>
    checkRequirement(smsConsent, r.keywords)
  ).length;
  const totalChecks = SMS_CONSENT_REQUIREMENTS.length;
  const allPassed = passedChecks === totalChecks;

  const handleSave = useCallback(() => {
    setEditingDisclaimer(false);
    setEditingSmsConsent(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          {!allPassed && (
            <span className="text-[10px] px-1.5 py-0 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 font-medium">
              {totalChecks - passedChecks} issue{totalChecks - passedChecks !== 1 ? "s" : ""}
            </span>
          )}
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
        <div className="p-4 space-y-6">
          {/* ─── SMS Consent Message ─── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  SMS Consent Message
                </h4>
                <span className={`text-[10px] px-1.5 py-0 rounded-full border font-medium ${
                  allPassed
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}>
                  {passedChecks}/{totalChecks} checks
                </span>
              </div>
              {!editingSmsConsent && (
                <button
                  type="button"
                  onClick={() => setEditingSmsConsent(true)}
                  className="flex items-center gap-1 text-[11px] text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>

            {editingSmsConsent ? (
              <div className="space-y-3">
                <textarea
                  ref={smsConsentRef}
                  value={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-brand-muted leading-relaxed bg-transparent border border-accent-blue/30 rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none"
                  placeholder="Enter your SMS consent message..."
                />
                <div className="text-[10px] text-brand-muted/80 text-right">
                  {smsConsent.length} characters
                </div>

                {/* Live compliance checks */}
                <div className="space-y-1.5">
                  {SMS_CONSENT_REQUIREMENTS.map((req) => {
                    const passed = checkRequirement(smsConsent, req.keywords);
                    return (
                      <div key={req.label} className="flex items-start gap-2">
                        {passed ? (
                          <svg className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <div>
                          <span className={`text-[11px] font-medium ${passed ? "text-green-400" : "text-red-400"}`}>
                            {req.label}
                          </span>
                          {!passed && (
                            <p className="text-[10px] text-brand-muted/80">{req.hint}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => { setSmsConsent(DEFAULT_SMS_CONSENT); }}
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
                <p className="text-xs text-brand-muted leading-relaxed">{smsConsent}</p>
              </div>
            )}

            <p className="text-[10px] text-brand-muted/80 mt-1.5">
              This message is sent as the first SMS to new leads and must meet TCPA / 10DLC / CTIA carrier requirements.
            </p>
          </div>

          {/* ─── General Consent Disclaimer ─── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Form Consent Disclaimer
              </h4>
              {!editingDisclaimer && (
                <button
                  type="button"
                  onClick={() => setEditingDisclaimer(true)}
                  className="flex items-center gap-1 text-[11px] text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>

            {editingDisclaimer ? (
              <div className="space-y-2">
                <textarea
                  ref={disclaimerRef}
                  value={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-brand-muted leading-relaxed bg-transparent border border-accent-blue/30 rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none"
                  placeholder="Enter your legal disclaimer..."
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setDisclaimer(DEFAULT_DISCLAIMER); }}
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

            <p className="text-[10px] text-brand-muted/80 mt-1.5">
              This text is shown to users on the lead capture form before they submit.
            </p>
          </div>

          {/* ─── Compliance checklist ─── */}
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

          {/* Save all button + saved indicator */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border/50">
            {saved && (
              <span className="text-[11px] text-green-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/30 hover:border-accent-blue/50 px-4 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
