"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type { Lead } from "@/lib/marketing/types";

type Channel = "sms" | "email";

interface AutomationStep {
  readonly id: string;
  readonly label: string;
  readonly delay: string;
  readonly description: string;
}

function createStep(label: string, delay: string, description: string): AutomationStep {
  return { id: crypto.randomUUID(), label, delay, description };
}

const DEFAULT_SMS_FLOW: readonly AutomationStep[] = [
  createStep(
    "Welcome SMS",
    "Immediate",
    "Thanks for reaching out! We'll be in touch within 24hrs. Reply STOP to opt out."
  ),
  createStep(
    "Challenge Question",
    "Day 2",
    "What's your biggest challenge right now? We'd love to help."
  ),
  createStep(
    "Social Proof",
    "Day 5",
    "We've helped clients increase efficiency by 40%. Check out our work."
  ),
  createStep(
    "Call-to-Action",
    "Day 10",
    "Let's schedule a quick 15-min call. Reply YES to connect."
  ),
  createStep(
    "Final Check-in",
    "Day 20",
    "We're here whenever you're ready. Visit our site or reply to chat."
  ),
];

const DEFAULT_EMAIL_FLOW: readonly AutomationStep[] = [
  createStep(
    "Welcome Email",
    "Immediate",
    "Thanks for reaching out! A team member will follow up within 24 hours."
  ),
  createStep(
    "Our Services",
    "Day 1",
    "Here's what we do best — custom web apps, SaaS, and digital experiences."
  ),
  createStep(
    "Case Study",
    "Day 3",
    "See what we've built — real examples and results from our portfolio."
  ),
  createStep(
    "Client Results",
    "Day 7",
    "What our clients are saying — real, measurable improvements."
  ),
  createStep(
    "Final Offer",
    "Day 14",
    "Ready to get started? Let's hop on a quick call — no pressure."
  ),
];

export default function MarketingPage() {
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(
    new Set()
  );
  const [activeChannel, setActiveChannel] = useState<Channel>("sms");
  const [smsFlow, setSmsFlow] = useState<readonly AutomationStep[]>(DEFAULT_SMS_FLOW);
  const [emailFlow, setEmailFlow] = useState<readonly AutomationStep[]>(DEFAULT_EMAIL_FLOW);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

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

  const currentFlow = activeChannel === "sms" ? smsFlow : emailFlow;
  const setCurrentFlow = activeChannel === "sms" ? setSmsFlow : setEmailFlow;

  const updateStep = useCallback(
    (stepId: string, field: keyof AutomationStep, value: string) => {
      setCurrentFlow((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, [field]: value } : s))
      );
    },
    [setCurrentFlow]
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      setCurrentFlow((prev) => prev.filter((s) => s.id !== stepId));
      setEditingStepId(null);
    },
    [setCurrentFlow]
  );

  const addStep = useCallback(() => {
    const channel = activeChannel === "sms" ? "SMS" : "Email";
    const newStep = createStep(
      `New ${channel} Step`,
      "Day ?",
      `Enter your ${channel.toLowerCase()} message here...`
    );
    setCurrentFlow((prev) => [...prev, newStep]);
    setEditingStepId(newStep.id);
  }, [activeChannel, setCurrentFlow]);

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
          Select leads and manage SMS &amp; Email automation flows
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
            <span className="text-sm text-white font-medium">Clients</span>
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
                  {lead.sms_consent && <ConsentBadge channel="sms" />}
                  {lead.email_consent && <ConsentBadge channel="email" />}
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
                Eligible (
                {activeChannel === "sms"
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {activeChannel === "sms" ? (
                <SmsIcon className="w-4 h-4 text-green-400" />
              ) : (
                <EmailIcon className="w-4 h-4 text-accent-blue" />
              )}
              {activeChannel === "sms"
                ? "SMS Automation Flow"
                : "Email Automation Flow"}
            </h3>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors px-3 py-1.5 rounded-lg border border-brand-border hover:border-accent-blue/40"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add Step
            </button>
          </div>

          <div className="relative">
            {currentFlow.map((step, index) => (
              <FlowStep
                key={step.id}
                step={step}
                index={index}
                isLast={index === currentFlow.length - 1}
                channel={activeChannel}
                isEditing={editingStepId === step.id}
                onEdit={() => setEditingStepId(step.id)}
                onCancel={() => setEditingStepId(null)}
                onUpdate={updateStep}
                onDelete={() => deleteStep(step.id)}
                canDelete={currentFlow.length > 1}
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
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
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
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
  canDelete,
}: {
  readonly step: AutomationStep;
  readonly index: number;
  readonly isLast: boolean;
  readonly channel: Channel;
  readonly isEditing: boolean;
  readonly onEdit: () => void;
  readonly onCancel: () => void;
  readonly onUpdate: (id: string, field: keyof AutomationStep, value: string) => void;
  readonly onDelete: () => void;
  readonly canDelete: boolean;
}) {
  const dotBg = channel === "sms" ? "bg-green-400" : "bg-accent-blue";
  const dotRing =
    channel === "sms" ? "ring-green-400/20" : "ring-accent-blue/20";
  const lineBg =
    channel === "sms" ? "bg-green-400/20" : "bg-accent-blue/20";
  const delayBg =
    channel === "sms"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-accent-blue/10 text-accent-blue border-accent-blue/20";

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-3 h-3 rounded-full ${dotBg} ring-4 ${dotRing}`} />
        {!isLast && (
          <div className={`w-0.5 flex-1 ${lineBg} min-h-[48px]`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        {isEditing ? (
          <EditableStepForm
            step={step}
            onUpdate={onUpdate}
            onDone={onCancel}
            onDelete={onDelete}
            canDelete={canDelete}
            delayBg={delayBg}
          />
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="w-full text-left group rounded-lg p-2 -m-2 hover:bg-brand-border/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-white font-medium">
                {step.label}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0 rounded-full border font-medium ${delayBg}`}
              >
                {step.delay}
              </span>
              <PencilIcon className="w-3 h-3 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>
            <p className="text-xs text-brand-muted leading-relaxed max-w-md">
              {step.description}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}

function EditableStepForm({
  step,
  onUpdate,
  onDone,
  onDelete,
  canDelete,
  delayBg,
}: {
  readonly step: AutomationStep;
  readonly onUpdate: (id: string, field: keyof AutomationStep, value: string) => void;
  readonly onDone: () => void;
  readonly onDelete: () => void;
  readonly canDelete: boolean;
  readonly delayBg: string;
}) {
  const labelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    labelRef.current?.focus();
  }, []);

  return (
    <div className="rounded-lg border border-accent-blue/30 bg-brand-border/10 p-3 space-y-3">
      {/* Label + Delay row */}
      <div className="flex items-center gap-2">
        <input
          ref={labelRef}
          type="text"
          value={step.label}
          onChange={(e) => onUpdate(step.id, "label", e.target.value)}
          className="flex-1 text-sm text-white font-medium bg-transparent border-b border-brand-border focus:border-accent-blue outline-none px-0 py-0.5"
          placeholder="Step name"
        />
        <input
          type="text"
          value={step.delay}
          onChange={(e) => onUpdate(step.id, "delay", e.target.value)}
          className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium bg-transparent outline-none w-20 text-center ${delayBg}`}
          placeholder="Day ?"
        />
      </div>

      {/* Description */}
      <textarea
        value={step.description}
        onChange={(e) => onUpdate(step.id, "description", e.target.value)}
        rows={2}
        className="w-full text-xs text-brand-muted leading-relaxed bg-transparent border border-brand-border rounded-md px-2 py-1.5 focus:border-accent-blue outline-none resize-none"
        placeholder="Message content..."
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        {canDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="w-3 h-3" />
            Delete
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={onDone}
          className="text-[11px] font-medium text-accent-blue hover:text-accent-purple transition-colors px-3 py-1 rounded-md border border-brand-border hover:border-accent-blue/40"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// --- Icons ---

function SmsIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
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
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function PencilIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function PlusIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function TrashIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}
