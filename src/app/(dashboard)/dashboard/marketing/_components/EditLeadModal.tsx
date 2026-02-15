"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Lead, LeadStatus } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import type { Pipeline } from "./LeadKanban";
import { PencilIcon } from "./icons";

interface EditLeadModalProps {
  readonly lead: Lead | null;
  readonly pipelines: readonly Pipeline[];
  readonly campaignNames: ReadonlyMap<string, string>;
  readonly onClose: () => void;
  readonly onSave: (lead: Lead) => void;
  readonly onDelete: (id: string) => void;
}

export function EditLeadModal({
  lead,
  pipelines,
  campaignNames,
  onClose,
  onSave,
  onDelete,
}: EditLeadModalProps) {
  const [draft, setDraft] = useState<Lead | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lead) {
      setDraft(lead);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [lead]);

  const updateField = useCallback(
    <K extends keyof Lead>(field: K, value: Lead[K]) => {
      setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const save = useCallback(() => {
    if (!draft) return;
    onSave({ ...draft, updated_at: new Date().toISOString() });
    onClose();
  }, [draft, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (!lead) return;
    onDelete(lead.id);
    onClose();
  }, [lead, onDelete, onClose]);

  const togglePipeline = useCallback(
    (pipelineId: string) => {
      if (!draft) return;
      const has = draft.assigned_pipelines.includes(pipelineId);
      const updated = has
        ? draft.assigned_pipelines.filter((id) => id !== pipelineId)
        : [...draft.assigned_pipelines, pipelineId];
      setDraft({ ...draft, assigned_pipelines: updated });
    },
    [draft]
  );

  const removeCampaign = useCallback(
    (campaignId: string) => {
      if (!draft) return;
      setDraft({
        ...draft,
        assigned_campaigns: draft.assigned_campaigns.filter((id) => id !== campaignId),
      });
    },
    [draft]
  );

  if (!lead || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1117] border border-brand-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <PencilIcon className="w-4 h-4 text-accent-blue" />
            <h3 className="text-lg font-bold text-white">Edit Lead</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-muted hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModalField
              ref={nameRef}
              label="Name"
              value={draft.name}
              onChange={(v) => updateField("name", v)}
            />
            <ModalField
              label="Company"
              value={draft.company ?? ""}
              onChange={(v) => updateField("company", v || null)}
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModalField
              label="Phone"
              value={draft.phone}
              onChange={(v) => updateField("phone", v)}
              type="tel"
            />
            <ModalField
              label="Email"
              value={draft.email}
              onChange={(v) => updateField("email", v)}
              type="email"
            />
          </div>

          {/* Address */}
          <ModalField
            label="Address"
            value={draft.address ?? ""}
            onChange={(v) => updateField("address", v || null)}
          />

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">Notes</label>
            <textarea
              value={draft.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value || null)}
              rows={2}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none placeholder:text-brand-muted/60"
              placeholder="Notes..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-2">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {LEAD_STATUS_CONFIG.map((s) => {
                const isActive = draft.status === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updateField("status", s.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      isActive
                        ? getStatusStyle(s.color)
                        : "text-brand-muted/70 border-brand-border/40 hover:border-brand-muted/50 hover:text-brand-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pipelines */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-2">Pipelines</label>
            <div className="space-y-1.5">
              {pipelines.map((pipeline) => {
                const isAssigned = draft.assigned_pipelines.includes(pipeline.id);
                return (
                  <button
                    key={pipeline.id}
                    type="button"
                    onClick={() => togglePipeline(pipeline.id)}
                    className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      isAssigned
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                        : "border-brand-border/30 bg-transparent text-brand-muted/70 hover:border-brand-muted/50 hover:text-brand-muted"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isAssigned
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-brand-muted/40"
                    }`}>
                      {isAssigned && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium">{pipeline.name}</span>
                      <span className="text-[10px] text-brand-muted/60 ml-2">
                        {pipeline.columns.length} stages
                      </span>
                    </div>
                    {isAssigned && (
                      <PipelineStageSelect
                        columns={pipeline.columns}
                        currentStatus={draft.status}
                        onSelect={(status) => updateField("status", status)}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campaigns (read-only with remove) */}
          {draft.assigned_campaigns.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-2">Campaigns</label>
              <div className="flex flex-wrap gap-1.5">
                {draft.assigned_campaigns.map((cid) => {
                  const name = campaignNames.get(cid);
                  if (!name) return null;
                  return (
                    <span
                      key={cid}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeCampaign(cid)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Consent toggles */}
          <div className="flex items-center gap-6">
            <ModalConsentToggle
              label="SMS Consent"
              checked={draft.sms_consent}
              onChange={(v) => updateField("sms_consent", v)}
              color="green"
            />
            <ModalConsentToggle
              label="Email Consent"
              checked={draft.email_consent}
              onChange={(v) => updateField("email_consent", v)}
              color="blue"
            />
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[10px] text-brand-muted/60 pt-1 border-t border-brand-border/30">
            <span>Source: {lead.source}</span>
            <span>Created: {new Date(lead.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(lead.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-brand-border bg-brand-border/5">
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-400/70 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40"
          >
            Delete Lead
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-brand-muted hover:text-white transition-colors px-4 py-2 rounded-lg border border-brand-border hover:border-brand-muted/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-5 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline stage selector (inline within pipeline row) ────────────────────

function PipelineStageSelect({
  columns,
  currentStatus,
  onSelect,
}: {
  readonly columns: readonly { readonly id: string; readonly status: LeadStatus; readonly label: string; readonly color: string }[];
  readonly currentStatus: LeadStatus;
  readonly onSelect: (status: LeadStatus) => void;
}) {
  const currentCol = columns.find((c) => c.status === currentStatus);

  return (
    <select
      value={currentStatus}
      onChange={(e) => {
        e.stopPropagation();
        onSelect(e.target.value as LeadStatus);
      }}
      onClick={(e) => e.stopPropagation()}
      className="text-[10px] text-cyan-400 bg-[#0f1117] border border-cyan-500/30 rounded px-1.5 py-0.5 outline-none focus:border-cyan-400 shrink-0 max-w-[100px]"
      title={currentCol ? `Stage: ${currentCol.label}` : "Select stage"}
    >
      {columns.map((col) => (
        <option key={col.id} value={col.status}>
          {col.label}
        </option>
      ))}
    </select>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusStyle(color: string): string {
  const map: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    gray: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  };
  return map[color] ?? map.blue;
}

import { forwardRef } from "react";

const ModalField = forwardRef<
  HTMLInputElement,
  {
    readonly label: string;
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly type?: string;
    readonly placeholder?: string;
  }
>(function ModalField({ label, value, onChange, type = "text", placeholder }, ref) {
  return (
    <div>
      <label className="block text-xs font-medium text-brand-muted mb-1.5">{label}</label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 outline-none placeholder:text-brand-muted/60 focus:border-accent-blue transition-colors"
      />
    </div>
  );
});

function ModalConsentToggle({
  label,
  checked,
  onChange,
  color,
}: {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (v: boolean) => void;
  readonly color: "green" | "blue";
}) {
  const bg = checked
    ? color === "green" ? "bg-green-500" : "bg-accent-blue"
    : "bg-brand-border";

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
    >
      <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${bg}`}>
        <div
          className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-3.5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-xs text-brand-muted">{label}</span>
    </button>
  );
}
