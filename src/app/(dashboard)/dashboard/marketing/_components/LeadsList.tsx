"use client";

import { useState, useCallback } from "react";
import type { Lead, MessageLog } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import { SmsIcon, EmailIcon, PencilIcon, MegaphoneIcon } from "./icons";
import type { Pipeline } from "./LeadKanban";

interface LeadsListProps {
  readonly leads: readonly Lead[];
  readonly selectedIds: ReadonlySet<string>;
  readonly focusedId: string | null;
  readonly onToggle: (id: string) => void;
  readonly onToggleAll: () => void;
  readonly onFocus: (id: string) => void;
  readonly onUpdateLead: (lead: Lead) => void;
  readonly onDeleteLead: (id: string) => void;
  readonly onEditLead: (lead: Lead) => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
  readonly pipelines: readonly Pipeline[];
}

export function LeadsList({
  leads,
  selectedIds,
  focusedId,
  onToggle,
  onToggleAll,
  onFocus,
  onUpdateLead,
  onDeleteLead,
  onEditLead,
  campaignNames,
  messageLogs,
  pipelines,
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
              focused={focusedId === lead.id}
              expanded={expandedId === lead.id}
              onToggle={() => onToggle(lead.id)}
              onFocus={() => onFocus(lead.id)}
              onExpand={() => toggleExpand(lead.id)}
              onUpdate={onUpdateLead}
              onDelete={onDeleteLead}
              onEdit={() => onEditLead(lead)}
              campaignNames={campaignNames}
              messageLogs={messageLogs.filter((m) => m.lead_id === lead.id)}
              pipelines={pipelines}
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
  focused,
  expanded,
  onToggle,
  onFocus,
  onExpand,
  onUpdate,
  onDelete,
  onEdit,
  campaignNames,
  messageLogs,
  pipelines,
}: {
  readonly lead: Lead;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onFocus: () => void;
  readonly onExpand: () => void;
  readonly onUpdate: (lead: Lead) => void;
  readonly onDelete: (id: string) => void;
  readonly onEdit: () => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
  readonly pipelines: readonly Pipeline[];
}) {
  const assignedNames = lead.assigned_campaigns
    .map((id) => campaignNames.get(id))
    .filter(Boolean);

  const assignedPipelineNames = lead.assigned_pipelines
    .map((id) => pipelines.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div>
      {/* Summary row */}
      <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${
        focused
          ? "bg-accent-blue/5 border-l-2 border-l-accent-blue"
          : "hover:bg-brand-border/10 border-l-2 border-l-transparent"
      }`}>
        <Checkbox checked={selected} onChange={onToggle} />
        <button
          type="button"
          onClick={onFocus}
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
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {lead.phone && <span className="text-xs text-brand-muted truncate">{lead.phone}</span>}
              {lead.email && <span className="text-xs text-brand-muted truncate hidden sm:inline">{lead.email}</span>}
              {assignedNames.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-purple-400">
                  <MegaphoneIcon className="w-2.5 h-2.5" />
                  {assignedNames.length} campaign{assignedNames.length !== 1 ? "s" : ""}
                </span>
              )}
              {assignedPipelineNames.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-cyan-400">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  {assignedPipelineNames.join(", ")}
                </span>
              )}
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="shrink-0 p-1.5 hover:bg-accent-blue/10 rounded-lg transition-colors group/edit"
          title="Edit lead"
        >
          <PencilIcon className="w-3.5 h-3.5 text-brand-muted/60 group-hover/edit:text-accent-blue transition-colors" />
        </button>
        <button
          type="button"
          onClick={onExpand}
          className="shrink-0 p-1 hover:bg-brand-border/20 rounded transition-colors"
          title={expanded ? "Collapse details" : "Expand details"}
        >
          <svg
            className={`w-4 h-4 text-brand-muted/60 transition-transform ${expanded ? "rotate-180" : ""}`}
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
        <LeadDetail lead={lead} onUpdate={onUpdate} onDelete={onDelete} campaignNames={campaignNames} messageLogs={messageLogs} pipelines={pipelines} />
      )}
    </div>
  );
}

// ─── Lead detail (expanded view) ──────────────────────────────────────────────

function LeadDetail({
  lead,
  onUpdate,
  onDelete,
  campaignNames,
  messageLogs,
  pipelines,
}: {
  readonly lead: Lead;
  readonly onUpdate: (lead: Lead) => void;
  readonly onDelete: (id: string) => void;
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly messageLogs: readonly MessageLog[];
  readonly pipelines: readonly Pipeline[];
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
    <div className="px-4 pb-3 pt-0 ml-7">
      <div className="rounded-lg border border-brand-border/50 bg-brand-border/5 px-3 py-2.5">
        {/* Header row — title + actions */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-brand-muted/60">
              {lead.source} · {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-[10px] text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <PencilIcon className="w-2.5 h-2.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(lead.id)}
                  className="flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
                  title="Delete lead"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancel}
                  className="text-[10px] text-brand-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="text-[10px] font-medium text-accent-blue hover:text-accent-purple transition-colors px-1.5 py-0.5 rounded border border-brand-border hover:border-accent-blue/40"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Compact fields grid — 3 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5">
          <CompactField label="Name" value={draft.name} editing={editing} onChange={(v) => updateField("name", v)} />
          <CompactField label="Company" value={draft.company ?? ""} editing={editing} onChange={(v) => updateField("company", v || null)} />
          <CompactField label="Phone" value={draft.phone} editing={editing} onChange={(v) => updateField("phone", v)} />
          <CompactField label="Email" value={draft.email} editing={editing} onChange={(v) => updateField("email", v)} />
          <CompactField label="Address" value={draft.address ?? ""} editing={editing} onChange={(v) => updateField("address", v || null)} className="col-span-2" />
        </div>

        {/* Notes — inline, single-line when not editing */}
        {(editing || lead.notes) && (
          <div className="mt-1.5">
            {editing ? (
              <textarea
                value={draft.notes ?? ""}
                onChange={(e) => updateField("notes", e.target.value || null)}
                rows={1}
                className="w-full text-[11px] text-brand-muted bg-transparent border border-brand-border rounded px-2 py-1 focus:border-accent-blue outline-none resize-none"
                placeholder="Notes..."
              />
            ) : (
              <p className="text-[11px] text-brand-muted/80 truncate">
                <span className="text-brand-muted/60">Notes:</span> {lead.notes}
              </p>
            )}
          </div>
        )}

        {/* Status + Campaigns — inline row */}
        <div className="flex flex-wrap items-center gap-1 mt-2">
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
                className={`text-[9px] px-1.5 py-0 rounded-full border font-medium transition-colors ${
                  isActive
                    ? getStatusActiveStyle(s.color)
                    : "text-brand-muted/60 border-brand-border/30 hover:border-brand-muted/40"
                }`}
              >
                {s.label}
              </button>
            );
          })}
          {lead.assigned_campaigns.map((cid) => {
            const name = campaignNames.get(cid);
            if (!name) return null;
            return (
              <span
                key={cid}
                className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium"
              >
                <MegaphoneIcon className="w-2 h-2" />
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
                  className="hover:text-red-400 transition-colors"
                >
                  <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
          {/* Pipeline badges */}
          {lead.assigned_pipelines.map((pid) => {
            const pipeline = pipelines.find((p) => p.id === pid);
            if (!pipeline) return null;
            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium"
              >
                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                {pipeline.name}
                <button
                  type="button"
                  onClick={() => {
                    const updated: Lead = {
                      ...lead,
                      assigned_pipelines: lead.assigned_pipelines.filter((id) => id !== pid),
                      updated_at: new Date().toISOString(),
                    };
                    onUpdate(updated);
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
          {/* Add pipeline dropdown */}
          <PipelineAddDropdown
            pipelines={pipelines}
            assignedIds={lead.assigned_pipelines}
            onAssign={(pid) => {
              const updated: Lead = {
                ...lead,
                assigned_pipelines: [...lead.assigned_pipelines, pid],
                updated_at: new Date().toISOString(),
              };
              onUpdate(updated);
            }}
          />
        </div>

        {/* Message History — compact */}
        {messageLogs.length > 0 && (
          <MessageHistory logs={messageLogs} />
        )}
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

function CompactField({
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
      <label className="text-[9px] text-brand-muted/70 uppercase tracking-wider">{label}</label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[11px] text-white bg-transparent border border-brand-border rounded px-1.5 py-0.5 focus:border-accent-blue outline-none"
        />
      ) : (
        <p className="text-[11px] text-white truncate">{value || "—"}</p>
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
    "bg-transparent text-brand-muted/50 border-brand-border/30 hover:border-brand-muted/40 hover:text-brand-muted/70";

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
    <div className="mt-2 pt-2 border-t border-brand-border/20">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[9px] text-brand-muted/70 uppercase tracking-wider">
          History
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

      <div className="max-h-[140px] overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-[9px] text-brand-muted/60 py-1 text-center">
            No {filter === "all" ? "" : filter} messages yet.
          </p>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`rounded border px-2 py-1.5 ${
                msg.channel === "sms"
                  ? "border-green-500/15 bg-green-500/5"
                  : "border-accent-blue/15 bg-accent-blue/5"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {msg.channel === "sms" ? (
                  <SmsIcon className="w-2.5 h-2.5 text-green-400 shrink-0" />
                ) : (
                  <EmailIcon className="w-2.5 h-2.5 text-accent-blue shrink-0" />
                )}
                {msg.subject && (
                  <span className="text-[10px] text-white font-medium truncate">{msg.subject}</span>
                )}
                {!msg.subject && (
                  <span className="text-[10px] text-brand-muted truncate">{msg.body}</span>
                )}
                <span className="text-[9px] text-brand-muted/60 ml-auto shrink-0">
                  {formatMessageDate(msg.sent_at)}
                </span>
                <MessageStatusBadge status={msg.status} />
              </div>
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
        active ? activeColor : "text-brand-muted/60 border-brand-border/20 hover:border-brand-muted/30"
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

function PipelineAddDropdown({
  pipelines,
  assignedIds,
  onAssign,
}: {
  readonly pipelines: readonly Pipeline[];
  readonly assignedIds: readonly string[];
  readonly onAssign: (pipelineId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const unassigned = pipelines.filter((p) => !assignedIds.includes(p.id));

  if (unassigned.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0 rounded-full border border-dashed border-cyan-500/30 text-cyan-400/60 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
      >
        <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Pipeline
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-[#0f1117] border border-brand-border rounded-lg shadow-xl py-1 min-w-[140px]">
          {unassigned.map((pipeline) => (
            <button
              key={pipeline.id}
              type="button"
              onClick={() => {
                onAssign(pipeline.id);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[11px] text-brand-muted hover:text-white hover:bg-brand-border/20 transition-colors"
            >
              {pipeline.name}
            </button>
          ))}
        </div>
      )}
    </div>
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
