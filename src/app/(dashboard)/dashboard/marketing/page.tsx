"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Lead } from "@/lib/marketing/types";

type Channel = "sms" | "email";

interface AutomationStep {
  readonly label: string;
  readonly delay: string;
  readonly description: string;
}

const SMS_FLOW: readonly AutomationStep[] = [
  {
    label: "Welcome SMS",
    delay: "Immediate",
    description:
      "Thanks for reaching out! We'll be in touch within 24hrs. Reply STOP to opt out.",
  },
  {
    label: "Challenge Question",
    delay: "Day 2",
    description:
      "What's your biggest challenge right now? We'd love to help.",
  },
  {
    label: "Social Proof",
    delay: "Day 5",
    description:
      "We've helped clients increase efficiency by 40%. Check out our work.",
  },
  {
    label: "Call-to-Action",
    delay: "Day 10",
    description:
      "Let's schedule a quick 15-min call. Reply YES to connect.",
  },
  {
    label: "Final Check-in",
    delay: "Day 20",
    description:
      "We're here whenever you're ready. Visit our site or reply to chat.",
  },
];

const EMAIL_FLOW: readonly AutomationStep[] = [
  {
    label: "Welcome Email",
    delay: "Immediate",
    description:
      "Thanks for reaching out! A team member will follow up within 24 hours.",
  },
  {
    label: "Our Services",
    delay: "Day 1",
    description:
      "Here's what we do best — custom web apps, SaaS, and digital experiences.",
  },
  {
    label: "Case Study",
    delay: "Day 3",
    description:
      "See what we've built — real examples and results from our portfolio.",
  },
  {
    label: "Client Results",
    delay: "Day 7",
    description:
      "What our clients are saying — real, measurable improvements.",
  },
  {
    label: "Final Offer",
    delay: "Day 14",
    description:
      "Ready to get started? Let's hop on a quick call — no pressure.",
  },
];

export default function MarketingPage() {
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(
    new Set()
  );
  const [activeChannel, setActiveChannel] = useState<Channel>("sms");

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const toggleLead = useCallback((id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedLeadIds((prev) => {
      if (prev.size === leads.length) {
        return new Set();
      }
      return new Set(leads.map((l) => l.id));
    });
  }, [leads]);

  const selectedLeads = useMemo(
    () => leads.filter((l) => selectedLeadIds.has(l.id)),
    [leads, selectedLeadIds]
  );

  const smsEligible = useMemo(
    () => selectedLeads.filter((l) => l.sms_consent),
    [selectedLeads]
  );

  const emailEligible = useMemo(
    () => selectedLeads.filter((l) => l.email_consent),
    [selectedLeads]
  );

  const currentFlow = activeChannel === "sms" ? SMS_FLOW : EMAIL_FLOW;

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-muted text-sm">Loading marketing data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketing</h1>
        <p className="text-brand-muted text-sm mt-1">
          Select leads and view SMS &amp; Email automation flows
        </p>
      </div>

      {/* Leads list with multi-select */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={leads.length > 0 && selectedLeadIds.size === leads.length}
              indeterminate={
                selectedLeadIds.size > 0 &&
                selectedLeadIds.size < leads.length
              }
              onChange={toggleAll}
            />
            <span className="text-sm text-white font-medium">
              Clients
            </span>
            <span className="text-xs text-brand-muted">
              {leads.length} total
            </span>
          </div>
          {selectedLeadIds.size > 0 && (
            <span className="text-xs text-accent-blue font-medium">
              {selectedLeadIds.size} selected
            </span>
          )}
        </div>

        {leads.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-brand-muted text-sm">
              No leads yet. They&apos;ll appear here when someone submits the
              contact form.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-border/50 max-h-80 overflow-y-auto">
            {leads.map((lead) => (
              <label
                key={lead.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-brand-border/10 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedLeadIds.has(lead.id)}
                  onChange={() => toggleLead(lead.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium truncate">
                      {lead.name}
                    </span>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-brand-muted truncate">
                      {lead.email}
                    </span>
                    <span className="text-xs text-brand-muted hidden sm:inline">
                      {lead.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lead.sms_consent && (
                    <ConsentBadge channel="sms" />
                  )}
                  {lead.email_consent && (
                    <ConsentBadge channel="email" />
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Channel tabs + flow */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        {/* Channel selector tabs */}
        <div className="flex border-b border-brand-border">
          <ChannelTab
            channel="sms"
            active={activeChannel === "sms"}
            count={smsEligible.length}
            onClick={() => setActiveChannel("sms")}
          />
          <ChannelTab
            channel="email"
            active={activeChannel === "email"}
            count={emailEligible.length}
            onClick={() => setActiveChannel("email")}
          />
        </div>

        {/* Eligible leads summary */}
        <div className="px-4 py-3 border-b border-brand-border/50 bg-brand-border/5">
          {selectedLeadIds.size === 0 ? (
            <p className="text-xs text-brand-muted">
              Select leads above to see who will receive{" "}
              {activeChannel === "sms" ? "SMS" : "email"} campaigns
            </p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-brand-muted">
                Eligible ({activeChannel === "sms"
                  ? smsEligible.length
                  : emailEligible.length}
                ):
              </span>
              {(activeChannel === "sms" ? smsEligible : emailEligible).map(
                (lead) => (
                  <span
                    key={lead.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-brand-border/30 text-white"
                  >
                    {lead.name}
                  </span>
                )
              )}
              {(activeChannel === "sms" ? smsEligible : emailEligible)
                .length === 0 && (
                <span className="text-xs text-red-400">
                  None of the selected leads have{" "}
                  {activeChannel === "sms" ? "SMS" : "email"} consent
                </span>
              )}
            </div>
          )}
        </div>

        {/* Automation flow visualization */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
            {activeChannel === "sms" ? (
              <SmsIcon className="w-4 h-4 text-green-400" />
            ) : (
              <EmailIcon className="w-4 h-4 text-accent-blue" />
            )}
            {activeChannel === "sms"
              ? "SMS Automation Flow"
              : "Email Automation Flow"}
          </h3>

          <div className="relative">
            {currentFlow.map((step, index) => (
              <FlowStep
                key={step.label}
                step={step}
                index={index}
                isLast={index === currentFlow.length - 1}
                channel={activeChannel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  readonly checked: boolean;
  readonly indeterminate?: boolean;
  readonly onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked || indeterminate
          ? "bg-accent-blue border-accent-blue"
          : "border-brand-muted/40 hover:border-brand-muted"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div className="w-2 h-0.5 bg-white rounded-full" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { readonly status: string }) {
  const styles: Record<string, string> = {
    new: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    converted: "bg-green-500/10 text-green-400 border-green-500/20",
    unsubscribed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-block px-1.5 py-0 rounded-full text-[10px] font-medium border ${
        styles[status] ?? styles.new
      }`}
    >
      {status}
    </span>
  );
}

function ConsentBadge({ channel }: { readonly channel: "sms" | "email" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
        channel === "sms"
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
      }`}
    >
      {channel === "sms" ? (
        <SmsIcon className="w-2.5 h-2.5" />
      ) : (
        <EmailIcon className="w-2.5 h-2.5" />
      )}
      {channel.toUpperCase()}
    </span>
  );
}

function ChannelTab({
  channel,
  active,
  count,
  onClick,
}: {
  readonly channel: Channel;
  readonly active: boolean;
  readonly count: number;
  readonly onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "text-white border-b-2 border-accent-blue bg-brand-border/10"
          : "text-brand-muted hover:text-white hover:bg-brand-border/5"
      }`}
    >
      {channel === "sms" ? (
        <SmsIcon className="w-4 h-4" />
      ) : (
        <EmailIcon className="w-4 h-4" />
      )}
      {channel === "sms" ? "SMS Campaign" : "Email Campaign"}
      {count > 0 && (
        <span
          className={`text-[10px] px-1.5 py-0 rounded-full ${
            active
              ? "bg-accent-blue/20 text-accent-blue"
              : "bg-brand-border/30 text-brand-muted"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function FlowStep({
  step,
  isLast,
  channel,
}: {
  readonly step: AutomationStep;
  readonly index: number;
  readonly isLast: boolean;
  readonly channel: Channel;
}) {
  const dotBg =
    channel === "sms"
      ? "bg-green-400"
      : "bg-accent-blue";
  const dotRing =
    channel === "sms"
      ? "ring-green-400/20"
      : "ring-accent-blue/20";
  const lineBg =
    channel === "sms"
      ? "bg-green-400/20"
      : "bg-accent-blue/20";
  const delayBg =
    channel === "sms"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-accent-blue/10 text-accent-blue border-accent-blue/20";

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-3 h-3 rounded-full ${dotBg} ring-4 ${dotRing}`}
        />
        {!isLast && (
          <div className={`w-0.5 flex-1 ${lineBg} min-h-[48px]`} />
        )}
      </div>

      {/* Content */}
      <div className={`pb-6 ${isLast ? "" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-white font-medium">
            {step.label}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0 rounded-full border font-medium ${delayBg}`}
          >
            {step.delay}
          </span>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </div>
  );
}

function SmsIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  );
}

function EmailIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}
