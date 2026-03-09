"use client";

import { useState } from "react";
import type { BillingPayment, BillingCustomer } from "@/lib/billing/types";

interface ReceiptsModalProps {
  readonly payments: readonly BillingPayment[];
  readonly customer: BillingCustomer;
  readonly onClose: () => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-500/15 text-ios-green";
    case "failed":
      return "bg-red-500/15 text-ios-red";
    case "refunded":
      return "bg-orange-500/15 text-orange-500";
    case "pending":
      return "bg-yellow-500/15 text-yellow-500";
    default:
      return "bg-ios-fill text-brand-muted";
  }
}

export default function ReceiptsModal({
  payments,
  customer,
  onClose,
}: ReceiptsModalProps) {
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSend(paymentId: string) {
    setSending(paymentId);
    try {
      const res = await fetch(`/api/billing/receipts/${customer.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (res.ok) {
        showToast("Receipt sent successfully!", true);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Failed to send receipt", false);
      }
    } catch {
      showToast("Failed to send receipt", false);
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-ios-lg bg-surface border border-separator shadow-ios-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-separator">
          <div>
            <h2 className="text-foreground font-semibold">Payment Receipts</h2>
            <p className="text-brand-muted text-xs mt-0.5">{customer.company_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {payments.length === 0 ? (
            <div className="px-5 py-10 text-center text-brand-muted text-sm">
              No payments recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-separator">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground text-sm font-medium">
                        {formatAmount(payment.amount)}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-brand-muted text-xs">
                      {formatDate(payment.paid_at)} · {payment.method}
                    </div>
                  </div>
                  <div className="ml-3 flex items-center gap-1.5 shrink-0">
                    <a
                      href={`/api/billing/receipts/${customer.id}/pdf?paymentId=${payment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-xs font-medium transition-colors"
                    >
                      View
                    </a>
                    {payment.status === "completed" && customer.email && (
                      <button
                        onClick={() => handleSend(payment.id)}
                        disabled={sending === payment.id}
                        className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {sending === payment.id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          "Send"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-separator">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] px-4 py-2.5 rounded-ios text-white text-[13px] font-medium shadow-ios-lg ${
            toast.ok ? "bg-ios-green" : "bg-ios-red"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
