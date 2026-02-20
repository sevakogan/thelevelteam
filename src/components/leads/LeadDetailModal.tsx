"use client";

import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import type { Lead } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";

interface LeadDetailModalProps {
  readonly lead: Lead | null;
  readonly onClose: () => void;
  readonly onSave: (lead: Lead) => void;
  readonly onDelete: (id: string) => void;
}

export function LeadDetailModal({
  lead,
  onClose,
  onSave,
  onDelete,
}: LeadDetailModalProps) {
  const [draft, setDraft] = useState<Lead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lead) {
      setDraft(lead);
      setConfirmDelete(false);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [lead]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (lead) {
      document.addEventListener("keydown", onKey);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [lead, onClose]);

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
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(lead.id);
    onClose();
  }, [lead, confirmDelete, onDelete, onClose]);

  if (!lead || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1117] border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-blue/15 flex items-center justify-center">
              <span className="text-accent-blue font-bold text-sm">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{lead.name}</h3>
              <p className="text-xs text-brand-muted mt-0.5">
                {lead.source} · {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" "}
                {new Date(lead.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-muted hover:text-white transition-colors p-1.5 hover:bg-brand-border/30 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Name + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              ref={nameRef}
              label="Name"
              value={draft.name}
              onChange={(v) => updateField("name", v)}
            />
            <Field
              label="Company"
              value={draft.company ?? ""}
              onChange={(v) => updateField("company", v || null)}
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Phone"
              value={draft.phone}
              onChange={(v) => updateField("phone", v)}
              type="tel"
            />
            <Field
              label="Email"
              value={draft.email}
              onChange={(v) => updateField("email", v)}
              type="email"
            />
          </div>

          {/* Address */}
          <Field
            label="Address"
            value={draft.address ?? ""}
            onChange={(v) => updateField("address", v || null)}
          />

          {/* Project Interest */}
          <Field
            label="Project Interest"
            value={draft.project_interest ?? ""}
            onChange={(v) => updateField("project_interest", v || null)}
          />

          {/* Message (from contact form) */}
          {draft.message && (
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1.5">Message</label>
              <div className="text-sm text-brand-muted/80 bg-brand-border/10 border border-brand-border/50 rounded-lg px-3 py-2 whitespace-pre-wrap">
                {draft.message}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">Notes</label>
            <textarea
              value={draft.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value || null)}
              rows={2}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none placeholder:text-brand-muted/60"
              placeholder="Add notes..."
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
                        ? statusStyle(s.color)
                        : "text-brand-muted/70 border-brand-border/40 hover:border-brand-muted/50 hover:text-brand-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consent toggles */}
          <div className="flex items-center gap-6">
            <ConsentToggle
              label="SMS Consent"
              checked={draft.sms_consent}
              onChange={(v) => updateField("sms_consent", v)}
              color="green"
            />
            <ConsentToggle
              label="Email Consent"
              checked={draft.email_consent}
              onChange={(v) => updateField("email_consent", v)}
              color="blue"
            />
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[10px] text-brand-muted/60 pt-2 border-t border-brand-border/30">
            <span>Source: {lead.source}</span>
            <span>
              Created: {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" "}
              {new Date(lead.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
            </span>
            <span>
              Updated: {new Date(lead.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" "}
              {new Date(lead.updated_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-brand-border bg-brand-border/5">
          <button
            type="button"
            onClick={handleDelete}
            className={`text-sm transition-colors px-3 py-1.5 rounded-lg border ${
              confirmDelete
                ? "text-white bg-red-500/80 border-red-500 hover:bg-red-500"
                : "text-red-400/70 hover:text-red-400 border-red-500/20 hover:border-red-500/40"
            }`}
          >
            {confirmDelete ? "Confirm Delete" : "Delete Lead"}
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
              className="text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-5 py-2 rounded-lg transition-colors shadow-lg shadow-accent-blue/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusStyle(color: string): string {
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

const Field = forwardRef<
  HTMLInputElement,
  {
    readonly label: string;
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly type?: string;
    readonly placeholder?: string;
  }
>(function Field({ label, value, onChange, type = "text", placeholder }, ref) {
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

function ConsentToggle({
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
