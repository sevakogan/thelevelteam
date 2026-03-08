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
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-lg h-full bg-surface border-l border-separator overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {customer ? "Edit Customer" : "New Customer"}
            </h2>
            <button
              onClick={onCancel}
              className="text-brand-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Company Name */}
            <FormField label="Company / Customer Name *" error={errors.company_name}>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="Acme Corp"
              />
            </FormField>

            {/* Job — Dropdown + Create New */}
            <FormField label="Job / Service" error={errors.job}>
              {!showNewJob ? (
                <div className="flex gap-2">
                  <select
                    value={jobId ?? ""}
                    onChange={(e) => setJobId(e.target.value || null)}
                    className="flex-1 px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                  >
                    <option value="">No job selected</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewJob(true)}
                    className="px-3 py-2 rounded-lg border border-separator text-accent hover:bg-ios-fill-tertiary text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    + New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={newJobRef}
                    type="text"
                    value={newJobName}
                    onChange={(e) => setNewJobName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateJob();
                      }
                      if (e.key === "Escape") {
                        setShowNewJob(false);
                        setNewJobName("");
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                    placeholder="Job name (e.g. Web Development)"
                    disabled={creatingJob}
                  />
                  <button
                    type="button"
                    onClick={handleCreateJob}
                    disabled={creatingJob || !newJobName.trim()}
                    className="px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {creatingJob ? "..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewJob(false);
                      setNewJobName("");
                    }}
                    className="px-2 py-2 rounded-lg text-brand-muted hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </FormField>

            {/* Description */}
            <FormField label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                placeholder="Web development services"
              />
            </FormField>

            {/* Amount */}
            <FormField label="Price (USD) *" error={errors.amount}>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="500.00"
              />
            </FormField>

            {/* Recurring Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-muted">
                Recurring (Monthly)
              </label>
              <ToggleSwitch value={recurring} onChange={setRecurring} />
            </div>

            {/* Due Date */}
            <FormField label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </FormField>

            {/* Invoice # (read-only in edit mode) */}
            {customer?.invoice_number && (
              <FormField label="Invoice #">
                <input
                  type="text"
                  value={customer.invoice_number}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg bg-ios-fill border border-separator text-brand-muted text-sm font-mono"
                />
              </FormField>
            )}

            {/* Tags */}
            <FormField label={`Tags (${tags.length}/20)`}>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/15 text-accent text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-foreground transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="Type tag and press Enter"
                disabled={tags.length >= 20}
              />
            </FormField>

            {/* Email */}
            <FormField label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="client@example.com"
              />
            </FormField>

            {/* Phone */}
            <FormField label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="(555) 123-4567"
              />
            </FormField>

            {/* Notes */}
            <FormField label="Notes (internal)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                placeholder="Internal notes about this customer..."
              />
            </FormField>

            {/* Divider */}
            <div className="h-px bg-separator my-2" />

            {/* Contract Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-muted">
                Include Contract
              </label>
              <ToggleSwitch
                value={contractEnabled}
                onChange={setContractEnabled}
              />
            </div>

            {/* Contract Content */}
            {contractEnabled && (
              <FormField label="Contract Content">
                <textarea
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                  placeholder="Enter contract terms and conditions..."
                />
              </FormField>
            )}

            {errors.form && (
              <p className="text-red-400 text-sm">{errors.form}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────

function FormField({
  label,
  error,
  children,
}: {
  readonly label: string;
  readonly error?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-muted mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ToggleSwitch({
  value,
  onChange,
}: {
  readonly value: boolean;
  readonly onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        value ? "bg-accent" : "bg-ios-fill"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          value ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
