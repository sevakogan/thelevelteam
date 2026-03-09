"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { BillingCustomer, BillingPayment, BillingJob, BillingStatus, CreateCustomerInput } from "@/lib/billing/types";
import { generateInvoicePDF } from "@/lib/billing/pdf";
import PaymentHistory from "../_components/PaymentHistory";
import CustomerForm from "../_components/CustomerForm";
import ReceiptsModal from "../_components/ReceiptsModal";
import StatusHistory from "../_components/StatusHistory";
import CancellationModal from "../_components/CancellationModal";
import RefundModal from "../_components/RefundModal";

const STATUS_COLORS: Record<BillingStatus, string> = {
  lead: "bg-ios-fill text-brand-muted",
  sent: "bg-blue-500/15 text-blue-400",
  viewed: "bg-purple-500/15 text-purple-400",
  paid: "bg-green-500/15 text-ios-green",
  in_process: "bg-blue-500/15 text-ios-blue",
  cancellation_requested: "bg-red-500/20 text-red-400",
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

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isOverdue(dateStr: string | null, status: BillingStatus): boolean {
  if (!dateStr || status === "done" || status === "lost" || status === "paid") return false;
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
  const [showReceipts, setShowReceipts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
      } else {
        showToast("Failed to generate share link");
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
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to send request");
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

  async function handleDelete() {
    if (!customer) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/billing/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/billing");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to delete");
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch {
      showToast("Failed to delete");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleRefund(paymentId: string, amount: number) {
    const res = await fetch("/api/billing/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, amount }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Refund failed");
    }

    await fetchData();
    showToast("Refund issued successfully.");
  }

  async function handleCancellationAction(action: {
    action: "approve" | "decline" | "discount";
    note?: string;
    discountType?: "percent" | "fixed";
    discountValue?: number;
  }) {
    if (!customer) return;
    const res = await fetch("/api/billing/cancellation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customer.id,
        ...action,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to process cancellation");
    }

    await fetchData();

    const messages: Record<string, string> = {
      approve: "Subscription cancelled.",
      decline: "Cancellation request declined.",
      discount: "Discount applied and customer notified.",
    };
    showToast(messages[action.action] ?? "Done.");
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

      {/* Cancellation Request Banner */}
      {customer.status === "cancellation_requested" && (
        <div className="rounded-ios-lg bg-red-500/10 border border-red-500/30 p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-red-400 font-semibold text-sm">Cancellation Requested</span>
              </div>
              {customer.cancellation_reason && (
                <p className="text-foreground text-sm mb-1">
                  Reason: <span className="text-brand-muted">{customer.cancellation_reason}</span>
                </p>
              )}
              <p className="text-brand-muted text-xs">
                Requested: {formatDateTime(customer.cancellation_requested_at)}
              </p>
            </div>
            <button
              onClick={() => setShowCancellation(true)}
              className="shrink-0 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
            >
              Handle Cancellation
            </button>
          </div>
        </div>
      )}

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
            {customer.status === "cancellation_requested"
              ? "Cancel Requested"
              : customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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
        <div className="flex flex-wrap gap-2">
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
          <button
            onClick={() => setShowReceipts(true)}
            className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            Receipts
          </button>
          {payments.filter((p) => p.status === "completed").length > 0 && (
            <button
              onClick={() => setShowRefund(true)}
              className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
            >
              Refund
            </button>
          )}
          <button
            onClick={() => setShowHistory(true)}
            className="px-3 py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            History
            {customer.status_history.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-ios-fill text-brand-muted text-[10px]">
                {customer.status_history.length}
              </span>
            )}
          </button>
          <div className="h-6 w-px bg-separator mx-1" />
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Payments &amp; Receipts
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

      {/* Receipts Modal */}
      {showReceipts && (
        <ReceiptsModal
          payments={payments}
          customer={customer}
          onClose={() => setShowReceipts(false)}
        />
      )}

      {/* Status History Modal */}
      {showHistory && (
        <StatusHistory
          history={customer.status_history}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Refund Modal */}
      {showRefund && (
        <RefundModal
          payments={payments}
          onRefund={handleRefund}
          onClose={() => setShowRefund(false)}
        />
      )}

      {/* Cancellation Modal */}
      {showCancellation && (
        <CancellationModal
          customer={customer}
          onAction={handleCancellationAction}
          onClose={() => setShowCancellation(false)}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm bg-surface rounded-ios-xl border border-separator shadow-ios-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="text-foreground font-semibold mb-1">Delete Invoice</h3>
            <p className="text-brand-muted text-sm mb-6">
              Delete <strong className="text-foreground">{customer.company_name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted text-sm hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
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
