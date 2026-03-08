"use client";

import { useState, useRef, useEffect } from "react";
import type {
  BillingCustomer,
  BillingJob,
  CreateCustomerInput,
} from "@/lib/billing/types";

interface CustomerFormProps {
  readonly customer?: BillingCustomer | null;
  readonly jobs: readonly BillingJob[];
  readonly onSave: (data: CreateCustomerInput) => Promise<void>;
  readonly onCancel: () => void;
  readonly onCreateJob: (name: string) => Promise<BillingJob>;
}

export default function CustomerForm({
  customer,
  jobs,
  onSave,
  onCancel,
  onCreateJob,
}: CustomerFormProps) {
  // ─── Form state ────────────────────────────────────────
  const [companyName, setCompanyName] = useState(customer?.company_name ?? "");
  const [description, setDescription] = useState(customer?.description ?? "");
  const [recurring, setRecurring] = useState(customer?.recurring ?? false);
  const [amount, setAmount] = useState(customer?.amount?.toString() ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [contractEnabled, setContractEnabled] = useState(
    customer?.contract_enabled ?? false
  );
  const [contractContent, setContractContent] = useState(
    customer?.contract_content ?? ""
  );
  const [jobId, setJobId] = useState<string | null>(customer?.job_id ?? null);
  const [tags, setTags] = useState<readonly string[]>(customer?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState(customer?.due_date ?? "");
  const [notes, setNotes] = useState(customer?.notes ?? "");

  // ─── Job creation state ────────────────────────────────
  const [showNewJob, setShowNewJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);
  const newJobRef = useRef<HTMLInputElement>(null);

  // ─── General state ─────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (showNewJob && newJobRef.current) {
      newJobRef.current.focus();
    }
  }, [showNewJob]);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  // ─── Tag handlers ──────────────────────────────────────
  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 20) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  // ─── Job creation ──────────────────────────────────────
  async function handleCreateJob() {
    if (!newJobName.trim()) return;
    setCreatingJob(true);
    try {
      const job = await onCreateJob(newJobName.trim());
      setJobId(job.id);
      setNewJobName("");
      setShowNewJob(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create job";
      setErrors({ ...errors, job: message });
    } finally {
      setCreatingJob(false);
    }
  }

  // ─── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.company_name = "Required";
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0)
      newErrors.amount = "Must be a valid positive number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        company_name: companyName.trim(),
        description: description.trim(),
        recurring,
        amount: parsedAmount,
        phone: phone.trim(),
        email: email.trim(),
        contract_enabled: contractEnabled,
        contract_content: contractContent.trim(),
        job_id: jobId,
        tags: [...tags],
        due_date: dueDate || null,
        notes: notes.trim(),
      });
    } catch {
      setErrors({ form: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-surface border border-separator rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-separator shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            {customer ? "Edit Customer" : "New Customer"}
          </h2>
          <button
            onClick={onCancel}
            className="text-brand-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 min-h-0 px-5 py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Company Name */}
            <Field label="Customer / Company *" error={errors.company_name}>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={input}
                placeholder="Acme Corp"
                autoFocus
              />
            </Field>

            {/* Job + Price row */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Job / Service" error={errors.job} className="col-span-1">
                {!showNewJob ? (
                  <div className="flex gap-1.5">
                    <select
                      value={jobId ?? ""}
                      onChange={(e) => setJobId(e.target.value || null)}
                      className={`${input} flex-1 min-w-0`}
                    >
                      <option value="">None</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewJob(true)}
                      className="px-2 py-1.5 rounded-lg border border-separator text-accent hover:bg-ios-fill-tertiary text-xs font-medium transition-colors shrink-0"
                    >
                      +New
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      ref={newJobRef}
                      type="text"
                      value={newJobName}
                      onChange={(e) => setNewJobName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleCreateJob(); }
                        if (e.key === "Escape") { setShowNewJob(false); setNewJobName(""); }
                      }}
                      className={`${input} flex-1 min-w-0`}
                      placeholder="Job name"
                      disabled={creatingJob}
                    />
                    <button
                      type="button"
                      onClick={handleCreateJob}
                      disabled={creatingJob || !newJobName.trim()}
                      className="px-2 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
                    >
                      {creatingJob ? "…" : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNewJob(false); setNewJobName(""); }}
                      className="text-brand-muted hover:text-foreground transition-colors shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </Field>

              <Field label="Price (USD) *" error={errors.amount} className="col-span-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={input}
                  placeholder="0.00"
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={`${input} resize-none`}
                placeholder="Web development services"
              />
            </Field>

            {/* Email + Phone row */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={input}
                  placeholder="client@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={input}
                  placeholder="(555) 123-4567"
                />
              </Field>
            </div>

            {/* Due Date + Recurring row */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Due Date">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={input}
                />
              </Field>
              <div className="flex flex-col justify-end pb-0.5">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-ios-fill-tertiary border border-separator h-[34px]">
                  <span className="text-xs text-brand-muted font-medium">Recurring</span>
                  <ToggleSwitch value={recurring} onChange={setRecurring} small />
                </div>
              </div>
            </div>

            {/* Tags */}
            <Field label={`Tags (${tags.length}/20)`}>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-accent/15 text-accent text-xs font-medium"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-foreground">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className={input}
                placeholder="Type tag and press Enter"
                disabled={tags.length >= 20}
              />
            </Field>

            {/* Notes */}
            <Field label="Notes (internal)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={`${input} resize-none`}
                placeholder="Internal notes..."
              />
            </Field>

            {/* Invoice # (edit mode) */}
            {customer?.invoice_number && (
              <Field label="Invoice #">
                <input
                  type="text"
                  value={customer.invoice_number}
                  readOnly
                  className="w-full px-3 py-1.5 rounded-lg bg-ios-fill border border-separator text-brand-muted text-xs font-mono"
                />
              </Field>
            )}

            {/* Contract */}
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-medium text-brand-muted">Include Contract</span>
              <ToggleSwitch value={contractEnabled} onChange={setContractEnabled} small />
            </div>

            {contractEnabled && (
              <Field label="Contract Content">
                <textarea
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  rows={4}
                  className={`${input} resize-none`}
                  placeholder="Enter contract terms and conditions..."
                />
              </Field>
            )}

            {errors.form && (
              <p className="text-red-400 text-xs">{errors.form}</p>
            )}
          </form>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-separator shrink-0 flex gap-2">
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : customer ? "Save Changes" : "Create Customer"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared input class ─────────────────────────────────
const input =
  "w-full px-3 py-1.5 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent";

// ─── Sub-components ─────────────────────────────────────

function Field({
  label,
  error,
  children,
  className,
}: {
  readonly label: string;
  readonly error?: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-brand-muted mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

function ToggleSwitch({
  value,
  onChange,
  small,
}: {
  readonly value: boolean;
  readonly onChange: (v: boolean) => void;
  readonly small?: boolean;
}) {
  const track = small ? "w-8 h-4" : "w-11 h-6";
  const thumb = small ? "w-3 h-3 top-0.5 left-0.5" : "w-5 h-5 top-0.5 left-0.5";
  const translate = small ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative ${track} rounded-full transition-colors ${value ? "bg-accent" : "bg-ios-fill"}`}
    >
      <span
        className={`absolute ${thumb} bg-white rounded-full transition-transform ${value ? translate : ""}`}
      />
    </button>
  );
}
