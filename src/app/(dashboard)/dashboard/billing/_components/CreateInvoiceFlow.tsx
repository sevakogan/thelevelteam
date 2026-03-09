"use client";

import { useState, useEffect, useRef } from "react";
import type { BillingClient, BillingJob, CreateCustomerInput } from "@/lib/billing/types";

interface CreateInvoiceFlowProps {
  readonly onSave: (data: CreateCustomerInput) => Promise<void>;
  readonly onCancel: () => void;
}

// ─── Step 1 — Client ──────────────────────────────────────────────────────────

function ClientStep({
  onSelect,
  onCancel,
}: {
  readonly onSelect: (client: BillingClient | null, newData?: { company_name: string; email: string; phone: string }) => void;
  readonly onCancel: () => void;
}) {
  const [clients, setClients] = useState<readonly BillingClient[]>([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"search" | "new">("search");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/billing/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = search.trim()
    ? clients.filter(
        (c) =>
          c.company_name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  async function handleCreateNew() {
    if (!newName.trim()) { setError("Company name is required"); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: newName.trim(), email: newEmail.trim(), phone: newPhone.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to create client");
        return;
      }
      const client = await res.json();
      onSelect(client);
    } catch {
      setError("Failed to create client");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-separator">
        <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
        <span className="text-foreground text-sm font-medium">Select or create client</span>
        <span className="mx-2 text-separator">→</span>
        <span className="w-6 h-6 rounded-full bg-ios-fill text-brand-muted text-xs font-bold flex items-center justify-center">2</span>
        <span className="text-brand-muted text-sm">Invoice details</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {mode === "search" ? (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients by name or email…"
                className="w-full pl-10 pr-4 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Client list */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-1 mb-4">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className="w-full text-left p-3 rounded-lg hover:bg-ios-fill-tertiary border border-transparent hover:border-separator transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground text-sm font-medium">{c.company_name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {c.email && <span className="text-brand-muted text-xs">{c.email}</span>}
                          {c.phone && <span className="text-brand-muted text-xs">{c.phone}</span>}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-brand-muted text-sm text-center py-6">
                {search ? `No clients matching "${search}"` : "No clients yet"}
              </p>
            )}

            {/* Create new */}
            <button
              onClick={() => { setMode("new"); setNewName(search); }}
              className="w-full py-2.5 rounded-lg border border-dashed border-separator text-brand-muted hover:text-foreground hover:border-accent text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create new client
            </button>
          </>
        ) : (
          /* New client form */
          <div className="space-y-4">
            <button onClick={() => setMode("search")} className="flex items-center gap-1 text-accent text-sm mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to search
            </button>

            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Company Name *</label>
              <input
                autoFocus
                type="text"
                autoComplete="off"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="text"
                autoComplete="off"
                inputMode="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Phone</label>
              <input
                type="text"
                autoComplete="off"
                inputMode="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
            {error && <p className="text-ios-red text-sm">{error}</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-separator flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted text-sm hover:text-foreground transition-colors">
          Cancel
        </button>
        {mode === "new" && (
          <button
            onClick={handleCreateNew}
            disabled={saving || !newName.trim()}
            className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {saving ? "Creating…" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 — Invoice ─────────────────────────────────────────────────────────

function InvoiceStep({
  client,
  onBack,
  onSave,
}: {
  readonly client: BillingClient;
  readonly onBack: () => void;
  readonly onSave: (data: CreateCustomerInput) => Promise<void>;
}) {
  const [jobs, setJobs] = useState<readonly BillingJob[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<readonly string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showNewJob, setShowNewJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  function addTag(tag: string) {
    const t = tag.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  async function handleCreateJob() {
    if (!newJobName.trim()) return;
    const res = await fetch("/api/billing/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newJobName.trim(), description: "" }),
    });
    if (res.ok) {
      const job = await res.json();
      const updated = await fetch("/api/billing/jobs").then((r) => r.json());
      setJobs(Array.isArray(updated) ? updated : []);
      setJobId(job.id);
      setShowNewJob(false);
      setNewJobName("");
    }
  }

  async function handleSubmit() {
    const parsedAmount = parseFloat(amount);
    if (!description.trim() && !jobId) { setError("Add a description or select a job"); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError("Enter a valid amount"); return; }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        company_name: client.company_name,
        email: client.email,
        phone: client.phone,
        description: description.trim(),
        amount: parsedAmount,
        recurring,
        due_date: dueDate || null,
        job_id: jobId,
        tags,
        notes: notes.trim(),
        contract_enabled: client.contract_enabled,
        contract_content: client.contract_content,
        client_id: client.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
      setSaving(false);
    }
  }

  const selectedJob = jobs.find((j) => j.id === jobId);

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-separator">
        <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">✓</span>
        <span className="text-brand-muted text-sm">{client.company_name}</span>
        <span className="mx-2 text-separator">→</span>
        <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">2</span>
        <span className="text-foreground text-sm font-medium">Invoice details</span>
      </div>

      {/* Client summary */}
      <div className="mx-6 mt-4 p-3 rounded-lg bg-ios-fill flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
          {client.company_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">{client.company_name}</p>
          <div className="flex items-center gap-2">
            {client.email && <span className="text-brand-muted text-xs">{client.email}</span>}
            {client.phone && <span className="text-brand-muted text-xs">{client.phone}</span>}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
        {/* Job */}
        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Job / Service</label>
          {!showNewJob ? (
            <div className="flex gap-2">
              <select
                value={jobId ?? ""}
                onChange={(e) => setJobId(e.target.value || null)}
                className="flex-1 px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              >
                <option value="">No job selected</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
              </select>
              <button onClick={() => setShowNewJob(true)} className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors">+ New</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateJob(); if (e.key === "Escape") setShowNewJob(false); }}
                placeholder="Job name"
                className="flex-1 px-3 py-2.5 bg-ios-fill rounded-lg border border-accent text-foreground text-sm focus:outline-none"
              />
              <button onClick={handleCreateJob} className="px-3 py-2 rounded-lg bg-accent text-white text-sm">Add</button>
              <button onClick={() => setShowNewJob(false)} className="px-3 py-2 rounded-lg border border-separator text-brand-muted text-sm">✕</button>
            </div>
          )}
          {selectedJob && <p className="text-brand-muted text-xs mt-1">{selectedJob.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you billing for?"
            className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Amount + Recurring */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Recurring + Invoice # */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-ios-fill border border-separator">
            <div>
              <p className="text-foreground text-sm font-medium">Recurring</p>
              <p className="text-brand-muted text-xs">Monthly billing</p>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className={`ml-auto w-10 h-6 rounded-full transition-colors relative ${recurring ? "bg-accent" : "bg-ios-fill-tertiary"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${recurring ? "translate-x-4.5 left-0.5" : "translate-x-0.5 left-0"}`} />
            </button>
          </div>
          <div>
            <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Invoice #</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
              className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs">
                {tag}
                <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-ios-red">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
            placeholder="Type tag and press Enter"
            className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes (not shown to customer)"
            rows={2}
            className="w-full px-3 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {error && <p className="text-ios-red text-sm">{error}</p>}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-separator flex gap-2">
        <button onClick={onBack} className="px-4 py-2.5 rounded-lg border border-separator text-brand-muted text-sm hover:text-foreground transition-colors">
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {saving ? "Creating…" : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}

// ─── Main flow ────────────────────────────────────────────────────────────────

export default function CreateInvoiceFlow({ onSave, onCancel }: CreateInvoiceFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClient, setSelectedClient] = useState<BillingClient | null>(null);

  function handleClientSelect(client: BillingClient | null) {
    setSelectedClient(client);
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-lg bg-surface rounded-ios-xl border border-separator shadow-ios-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 1 ? (
          <ClientStep onSelect={handleClientSelect} onCancel={onCancel} />
        ) : selectedClient ? (
          <InvoiceStep
            client={selectedClient}
            onBack={() => setStep(1)}
            onSave={onSave}
          />
        ) : null}
      </div>
    </div>
  );
}
