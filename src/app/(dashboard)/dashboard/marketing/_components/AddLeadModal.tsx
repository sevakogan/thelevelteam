"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Lead, LeadStatus } from "@/lib/marketing/types";

interface AddLeadModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onAdd: (lead: Lead) => void;
}

interface LeadDraft {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  notes: string;
  sms_consent: boolean;
  email_consent: boolean;
}

const EMPTY_DRAFT: LeadDraft = {
  name: "",
  email: "",
  phone: "",
  address: "",
  company: "",
  notes: "",
  sms_consent: true,
  email_consent: true,
};

export function AddLeadModal({ open, onClose, onAdd }: AddLeadModalProps) {
  const [draft, setDraft] = useState<LeadDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadDraft, string>>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(EMPTY_DRAFT);
      setErrors({});
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  const updateField = useCallback(
    <K extends keyof LeadDraft>(field: K, value: LeadDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof LeadDraft, string>> = {};
    if (!draft.name.trim()) next.name = "Name is required";
    if (!draft.phone.trim() && !draft.email.trim()) {
      next.phone = "Phone or email required";
      next.email = "Phone or email required";
    }
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      next.email = "Invalid email format";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [draft]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    const now = new Date().toISOString();
    const lead: Lead = {
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim() || null,
      company: draft.company.trim() || null,
      notes: draft.notes.trim() || null,
      message: null,
      project_interest: null,
      source: "manual",
      status: "incoming" as LeadStatus,
      sms_consent: draft.sms_consent,
      email_consent: draft.email_consent,
      assigned_campaigns: [],
      created_at: now,
      updated_at: now,
    };
    onAdd(lead);
    onClose();
  }, [draft, validate, onAdd, onClose]);

  if (!open) return null;

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
          <h3 className="text-lg font-bold text-white">Add a Lead</h3>
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
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name + Company row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              ref={nameRef}
              label="Name *"
              value={draft.name}
              onChange={(v) => updateField("name", v)}
              error={errors.name}
              placeholder="John Smith"
            />
            <Field
              label="Company"
              value={draft.company}
              onChange={(v) => updateField("company", v)}
              placeholder="Acme Inc."
            />
          </div>

          {/* Phone + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Phone"
              value={draft.phone}
              onChange={(v) => updateField("phone", v)}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
            <Field
              label="Email"
              value={draft.email}
              onChange={(v) => updateField("email", v)}
              error={errors.email}
              placeholder="john@example.com"
              type="email"
            />
          </div>

          {/* Address */}
          <Field
            label="Address"
            value={draft.address}
            onChange={(v) => updateField("address", v)}
            placeholder="123 Main St, City, ST 12345"
          />

          {/* Notes / reason for inquiry */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">
              Reason for Inquiry / Notes
            </label>
            <textarea
              value={draft.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="w-full text-sm text-white bg-transparent border border-brand-border rounded-lg px-3 py-2 focus:border-accent-blue outline-none resize-none placeholder:text-brand-muted/40"
              placeholder="What are they looking for? Any context or details..."
            />
          </div>

          {/* Consent toggles */}
          <div className="flex items-center gap-6 pt-1">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-brand-border bg-brand-border/5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-brand-muted hover:text-white transition-colors px-4 py-2 rounded-lg border border-brand-border hover:border-brand-muted/50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-5 py-2 rounded-lg transition-colors"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────

import { forwardRef } from "react";

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
  readonly placeholder?: string;
  readonly type?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  function Field({ label, value, onChange, error, placeholder, type = "text" }, ref) {
    return (
      <div>
        <label className="block text-xs font-medium text-brand-muted mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-sm text-white bg-transparent border rounded-lg px-3 py-2 outline-none placeholder:text-brand-muted/40 transition-colors ${
            error
              ? "border-red-500 focus:border-red-400"
              : "border-brand-border focus:border-accent-blue"
          }`}
        />
        {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

// ─── Consent toggle ───────────────────────────────────────────────────────────

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
    ? color === "green"
      ? "bg-green-500"
      : "bg-accent-blue"
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
