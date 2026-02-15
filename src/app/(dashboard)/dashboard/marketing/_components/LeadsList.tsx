"use client";

import { useState, useCallback } from "react";
import type { Lead, MessageLog } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import { SmsIcon, EmailIcon, PencilIcon, MegaphoneIcon } from "./icons";

interface LeadsListProps {
  readonly leads: readonly Lead[];
  readonly selectedIds: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onToggleAll: () => void;
  readonly onUpdateLead: (lead: Lead) => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
}

export function LeadsList({
  leads,
  selectedIds,
  onToggle,
  onToggleAll,
  onUpdateLead,
  campaignNames,
  messageLogs,
}: LeadsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={leads.length > 0 && selectedIds.size === leads.length}
            indeterminate={selectedIds.size > 0 && selectedIds.size < leads.length}
            onChange={onToggleAll}
          />
          <span className="text-sm text-white font-medium">Clients</span>
          <span className="text-xs text-brand-muted">{leads.length} total</span>
        </div>
        {selectedIds.size > 0 && (
          <span className="text-xs text-accent-blue font-medium">
            {selectedIds.size} selected
          </span>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-brand-muted text-sm">
            No leads yet. Add one manually or wait for form submissions.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-brand-border/50 max-h-[400px] overflow-y-auto">
          {leads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              selected={selectedIds.has(lead.id)}
              expanded={expandedId === lead.id}
              onToggle={() => onToggle(lead.id)}
              onExpand={() => toggleExpand(lead.id)}
              onUpdate={onUpdateLead}
              campaignNames={campaignNames}
              messageLogs={messageLogs.filter((m) => m.lead_id === lead.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lead row with expandable detail ──────────────────────────────────────────

function LeadRow({
  lead,
  selected,
  expanded,
  onToggle,
  onExpand,
  onUpdate,
  campaignNames,
  messageLogs,
}: {
  readonly lead: Lead;
  readonly selected: boolean;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onExpand: () => void;
  readonly onUpdate: (lead: Lead) => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
}) {
  const assignedNames = lead.assigned_campaigns
    .map((id) => campaignNames.get(id))
    .filter(Boolean);

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-brand-border/10 transition-colors">
        <Checkbox checked={selected} onChange={onToggle} />
        <button
          type="button"
          onClick={onExpand}
          className="flex-1 min-w-0 text-left flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-medium truncate">
                {lead.name}
              </span>
              {lead.company && (
                <span className="text-xs text-brand-muted truncate hidden sm:inline">
                  @ {lead.company}
                </span>
              )}
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              {lead.phone && <span className="text-xs text-brand-muted truncate">{lead.phone}</span>}
              {lead.email && <span className="text-xs text-brand-muted truncate hidden sm:inline">{lead.email}</span>}
              {assignedNames.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-purple-400">
                  <MegaphoneIcon className="w-2.5 h-2.5" />
                  {assignedNames.length} campaign{assignedNames.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-brand-muted/40 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <ConsentToggle
            channel="sms"
            active={lead.sms_consent}
            onToggle={() =>
              onUpdate({
                ...lead,
                sms_consent: !lead.sms_consent,
                updated_at: new Date().toISOString(),
              })
            }
          />
          <ConsentToggle
            channel="email"
            active={lead.email_consent}
            onToggle={() =>
              onUpdate({
                ...lead,
                email_consent: !lead.email_consent,
                updated_at: new Date().toISOString(),
              })
            }
          />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <LeadDetail lead={lead} onUpdate={onUpdate} campaignNames={campaignNames} messageLogs={messageLogs} />
      )}
    </div>
  );
}

// ─── Lead detail (expanded view) ──────────────────────────────────────────────

function LeadDetail({
  lead,
  onUpdate,
  campaignNames,
  messageLogs,
}: {
  readonly lead: Lead;
  readonly onUpdate: (lead: Lead) => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lead);

  const updateField = useCallback(
    <K extends keyof Lead>(field: K, value: Lead[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const save = useCallback(() => {
    onUpdate({ ...draft, updated_at: new Date().toISOString() });
    setEditing(false);
  }, [draft, onUpdate]);

  const cancel = useCallback(() => {
    setDraft(lead);
    setEditing(false);
  }, [lead]);

  return (
    <div className="px-4 pb-4 pt-0 ml-7">
      <div className="rounded-lg border border-brand-border/50 bg-brand-border/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Client Details
          </h4>
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-[11px] text-accent-blue hover:text-accent-purple transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancel}
                className="text-[11px] text-brand-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="text-[11px] font-medium text-accent-blue hover:text-accent-purple transition-colors px-2 py-0.5 rounded border border-brand-border hover:border-accent-blue/40"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailField label="Name" value={draft.name} editing={editing} onChange={(v) => updateField("name", v)} />
          <DetailField label="Company" value={draft.company ?? ""} editing={editing} onChange={(v) => updateField("company", v || null)} />
          <DetailField label="Phone" value={draft.phone} editing={editing} onChange={(v) => updateField("phone", v)} />
          <DetailField label="Email" value={draft.email} editing={editing} onChange={(v) => updateField("email", v)} />
          <DetailField label="Address" value={draft.address ?? ""} editing={editing} onChange={(v) => updateField("address", v || null)} className="sm:col-span-2" />
        </div>

        {/* Notes */}
        <div className="mt-3">
          <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
            Notes / Reason for Inquiry
          </label>
          {editing ? (
            <textarea
              value={draft.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value || null)}
              rows={2}
              className="w-full text-xs text-brand-muted bg-transparent border border-brand-border rounded-md px-2 py-1.5 mt-1 focus:border-accent-blue outline-none resize-none"
              placeholder="Add notes..."
            />
          ) : (
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              {lead.notes || "—"}
            </p>
          )}
        </div>

        {/* Status picker */}
        <div className="mt-3">
          <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {LEAD_STATUS_CONFIG.map((s) => {
              const isActive = draft.status === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    updateField("status", s.value);
                    if (!editing) {
                      onUpdate({ ...lead, status: s.value, updated_at: new Date().toISOString() });
                    }
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors ${
                    isActive
                      ? getStatusActiveStyle(s.color)
                      : "text-brand-muted/60 border-brand-border/40 hover:border-brand-muted/40"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assigned Campaigns */}
        {lead.assigned_campaigns.length > 0 && (
          <div className="mt-3">
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
              Assigned Campaigns
            </label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {lead.assigned_campaigns.map((cid) => {
                const name = campaignNames.get(cid);
                if (!name) return null;
                return (
                  <span
                    key={cid}
                    className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium"
                  >
                    <MegaphoneIcon className="w-2.5 h-2.5" />
                    {name}
                    <button
                      type="button"
                      onClick={() => {
                        const updated: Lead = {
                          ...lead,
                          assigned_campaigns: lead.assigned_campaigns.filter((id) => id !== cid),
                          updated_at: new Date().toISOString(),
                        };
                        onUpdate(updated);
                      }}
                      className="ml-0.5 hover:text-red-400 transition-colors"
                      title="Remove campaign"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Message History */}
        {messageLogs.length > 0 && (
          <MessageHistory logs={messageLogs} />
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-brand-border/30">
          <span className="text-[10px] text-brand-muted/40">
            Source: {lead.source}
          </span>
          <span className="text-[10px] text-brand-muted/40">
            Added: {new Date(lead.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusActiveStyle(color: string): string {
  const map: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    green: "bg-green-500/10 text-green-400 border-green-500/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };
  return map[color] ?? map.blue;
}

function DetailField({
  label,
  value,
  editing,
  onChange,
  className = "",
}: {
  readonly label: string;
  readonly value: string;
  readonly editing: boolean;
  readonly onChange: (v: string) => void;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
        {label}
      </label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs text-white bg-transparent border border-brand-border rounded-md px-2 py-1.5 mt-1 focus:border-accent-blue outline-none"
        />
      ) : (
        <p className="text-xs text-white mt-1">{value || "—"}</p>
      )}
    </div>
  );
}

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
      {indeterminate && !checked && <div className="w-2 h-0.5 bg-white rounded-full" />}
    </button>
  );
}

function StatusBadge({ status }: { readonly status: string }) {
  const config = LEAD_STATUS_CONFIG.find((s) => s.value === status);
  const style = config ? getStatusActiveStyle(config.color) : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <span className={`inline-block px-1.5 py-0 rounded-full text-[10px] font-medium border ${style}`}>
      {config?.label ?? status}
    </span>
  );
}

function ConsentToggle({
  channel,
  active,
  onToggle,
}: {
  readonly channel: "sms" | "email";
  readonly active: boolean;
  readonly onToggle: () => void;
}) {
  const activeStyle =
    channel === "sms"
      ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
      : "bg-accent-blue/10 text-accent-blue border-accent-blue/20 hover:bg-accent-blue/20";
  const inactiveStyle =
    "bg-transparent text-brand-muted/30 border-brand-border/30 hover:border-brand-muted/40 hover:text-brand-muted/50";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
        active ? activeStyle : inactiveStyle
      }`}
      title={`${active ? "Disable" : "Enable"} ${channel.toUpperCase()} consent`}
    >
      {channel === "sms" ? <SmsIcon className="w-2.5 h-2.5" /> : <EmailIcon className="w-2.5 h-2.5" />}
      {channel.toUpperCase()}
    </button>
  );
}

// ─── Message History ──────────────────────────────────────────────────────────

function MessageHistory({ logs }: { readonly logs: readonly MessageLog[] }) {
  const [filter, setFilter] = useState<"all" | "sms" | "email">("all");

  const sorted = [...logs].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  );

  const filtered = filter === "all" ? sorted : sorted.filter((m) => m.channel === filter);

  const smsCount = logs.filter((m) => m.channel === "sms").length;
  const emailCount = logs.filter((m) => m.channel === "email").length;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] font-medium text-brand-muted uppercase tracking-wider">
          Message History
        </label>
        <div className="flex items-center gap-1">
          <HistoryFilterButton
            label="All"
            count={logs.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <HistoryFilterButton
            label="SMS"
            count={smsCount}
            active={filter === "sms"}
            onClick={() => setFilter("sms")}
            color="green"
          />
          <HistoryFilterButton
            label="Email"
            count={emailCount}
            active={filter === "email"}
            onClick={() => setFilter("email")}
            color="blue"
          />
        </div>
      </div>

      <div className="max-h-[200px] overflow-y-auto space-y-1.5">
        {filtered.length === 0 ? (
          <p className="text-[10px] text-brand-muted/40 py-2 text-center">
            No {filter === "all" ? "" : filter} messages yet.
          </p>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-2.5 ${
                msg.channel === "sms"
                  ? "border-green-500/15 bg-green-500/5"
                  : "border-accent-blue/15 bg-accent-blue/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.channel === "sms" ? (
                  <SmsIcon className="w-3 h-3 text-green-400 shrink-0" />
                ) : (
                  <EmailIcon className="w-3 h-3 text-accent-blue shrink-0" />
                )}
                <span className={`text-[10px] font-medium ${
                  msg.channel === "sms" ? "text-green-400" : "text-accent-blue"
                }`}>
                  {msg.channel === "sms" ? "SMS" : "Email"}
                </span>
                <span className="text-[10px] text-brand-muted/40">→</span>
                <span className="text-[10px] text-brand-muted truncate">{msg.to}</span>
                <span className="text-[10px] text-brand-muted/40 ml-auto shrink-0">
                  {formatMessageDate(msg.sent_at)}
                </span>
                <MessageStatusBadge status={msg.status} />
              </div>
              {msg.subject && (
                <p className="text-[10px] text-white font-medium mb-0.5 ml-5">
                  {msg.subject}
                </p>
              )}
              <p className="text-[10px] text-brand-muted leading-relaxed ml-5 line-clamp-2">
                {msg.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HistoryFilterButton({
  label,
  count,
  active,
  onClick,
  color,
}: {
  readonly label: string;
  readonly count: number;
  readonly active: boolean;
  readonly onClick: () => void;
  readonly color?: "green" | "blue";
}) {
  const activeColor =
    color === "green"
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : color === "blue"
      ? "text-accent-blue border-accent-blue/30 bg-accent-blue/10"
      : "text-white border-brand-muted/40 bg-brand-border/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium transition-colors ${
        active ? activeColor : "text-brand-muted/40 border-brand-border/20 hover:border-brand-muted/30"
      }`}
    >
      {label} {count > 0 && <span className="ml-0.5">{count}</span>}
    </button>
  );
}

function MessageStatusBadge({ status }: { readonly status: string }) {
  const styles: Record<string, string> = {
    sent: "text-yellow-400 bg-yellow-500/10",
    delivered: "text-green-400 bg-green-500/10",
    failed: "text-red-400 bg-red-500/10",
    bounced: "text-orange-400 bg-orange-500/10",
  };
  return (
    <span className={`text-[8px] px-1 py-0 rounded font-medium uppercase shrink-0 ${styles[status] ?? styles.sent}`}>
      {status}
    </span>
  );
}

function formatMessageDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}
