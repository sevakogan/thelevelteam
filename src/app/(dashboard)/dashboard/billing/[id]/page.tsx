"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { BillingCustomer, BillingPayment, BillingJob, BillingStatus, CreateCustomerInput } from "@/lib/billing/types";
import { generateInvoicePDF } from "@/lib/billing/pdf";
import PaymentHistory from "../_components/PaymentHistory";
import CustomerForm from "../_components/CustomerForm";

const STATUS_COLORS: Record<BillingStatus, string> = {
  lead: "bg-ios-fill text-brand-muted",
  in_process: "bg-blue-500/15 text-ios-blue",
  done: "bg-green-500/15 text-ios-green",
  lost: "bg-red-500/15 text-ios-red",
};

const TAG_COLORS = [
  "bg-purple-500/15 text-purple-500",
  "bg-blue-500/15 text-ios-blue",
  "bg-orange-500/15 text-orange-500",
  "bg-pink-500/15 text-pink-500",
  "bg-teal-500/15 text-teal-500",
];

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dateStr: string | null, status: BillingStatus): boolean {
  if (!dateStr || status === "done" || status === "lost") return false;
  return new Date(dateStr) < new Date();
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<BillingCustomer | null>(null);
  const [payments, setPayments] = useState<readonly BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [jobs, setJobs] = useState<readonly BillingJob[]>([]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/billing/customers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        setPayments(data.payments);
      } else {
        router.push("/dashboard/billing");
      }
    } catch {
      router.push("/dashboard/billing");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleShare() {
    if (!customer) return;
    try {
      const res = await fetch("/api/billing/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      if (res.ok) {
        const { url } = await res.json();
        await navigator.clipboard.writeText(url);
        showToast("Share link copied!");
      }
    } catch {
      showToast("Failed to generate link");
    }
  }

  function handleDownload() {
    if (!customer) return;
    generateInvoicePDF(customer, payments);
  }

  async function handleSendRequest() {
    if (!customer) return;
    if (!customer.email && !customer.phone) {
      showToast("Customer has no email or phone");
      return;
    }

    try {
      const res = await fetch("/api/billing/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      if (res.ok) {
        await fetchData();
        showToast("Payment request sent!");
      }
    } catch {
      showToast("Failed to send request");
    }
  }

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
      /* jobs are optional for editing */
    }
  }, []);

  async function handleOpenEdit() {
    await fetchJobs();
    setShowEdit(true);
  }

  async function handleSaveEdit(data: CreateCustomerInput) {
    const res = await fetch(`/api/billing/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to save");

    await fetchData();
    setShowEdit(false);
    showToast("Customer updated!");
  }

  async function handleCreateJob(name: string): Promise<BillingJob> {
    const res = await fetch("/api/billing/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: "" }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create job");
    }

    const job = await res.json();
    await fetchJobs();
    return job;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) return null;

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = customer.amount - totalPaid;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/billing")}
        className="flex items-center gap-1 text-accent hover:text-accent-hover text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Billing
      </button>

      {/* Customer Header */}
      <div className="rounded-ios-lg bg-surface border border-separator p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">
                {customer.company_name}
              </h1>
              {customer.invoice_number && (
                <span className="text-sm font-mono text-brand-muted">
                  {customer.invoice_number}
                </span>
              )}
            </div>
            {customer.description && (
              <p className="text-brand-muted text-sm">{customer.description}</p>
            )}
            {customer.job_name && (
              <p className="text-accent text-sm mt-0.5">
                {customer.job_name}
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              STATUS_COLORS[customer.status]
            }`}
          >
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatBlock label="Amount" value={formatAmount(customer.amount)} />
          <StatBlock
            label="Type"
            value={customer.recurring ? "Recurring" : "One-time"}
            accent={customer.recurring}
          />
          <StatBlock
            label="Total Paid"
            value={formatAmount(totalPaid)}
            className="text-ios-green"
          />
          <StatBlock
            label="Outstanding"
            value={formatAmount(Math.max(0, outstanding))}
            className={outstanding > 0 ? "text-ios-red" : "text-ios-green"}
          />
        </div>

        {/* Due date */}
        {customer.due_date && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-brand-muted uppercase tracking-wider">Due:</span>
            <span
              className={`text-sm font-medium ${
                isOverdue(customer.due_date, customer.status)
                  ? "text-ios-red"
                  : "text-foreground"
              }`}
            >
              {formatDate(customer.due_date)}
              {isOverdue(customer.due_date, customer.status) && (
                <span className="ml-1 text-xs text-ios-red">(Overdue)</span>
              )}
            </span>
          </div>
        )}

        {/* Tags */}
        {customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {customer.tags.map((tag, i) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Contact info */}
        <div className="flex gap-4 text-sm text-brand-muted mb-4">
          {customer.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {customer.email}
            </span>
          )}
          {customer.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {customer.phone}
            </span>
          )}
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="mb-4 p-3 rounded-lg bg-ios-fill-tertiary">
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{customer.notes}</p>
          </div>
        )}

        {/* Contract status */}
        {customer.contract_enabled && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-brand-muted">Contract:</span>
            {customer.contract_signed ? (
              <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-ios-green text-xs font-medium">
                Signed by {customer.contract_signed_by}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 text-xs font-medium">
                Awaiting signature
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSendRequest}
            className="px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
          >
            Send Request
          </button>
          <button
            onClick={handleOpenEdit}
            className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </span>
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            Share Link
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Payments & Receipts
        </h2>
        <PaymentHistory payments={payments} />
      </div>

      {/* Edit Form Slide-over */}
      {showEdit && (
        <CustomerForm
          customer={customer}
          jobs={jobs}
          onSave={handleSaveEdit}
          onCancel={() => setShowEdit(false)}
          onCreateJob={handleCreateJob}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-ios bg-surface-tertiary text-foreground text-[13px] font-medium shadow-ios-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────

function StatBlock({
  label,
  value,
  accent,
  className = "",
}: {
  readonly label: string;
  readonly value: string;
  readonly accent?: boolean;
  readonly className?: string;
}) {
  return (
    <div>
      <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          accent ? "text-accent" : className || "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
