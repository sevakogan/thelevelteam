"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bentoChild } from "@/lib/animations";
import type { BillingCustomer, BillingPayment, BillingStatus } from "@/lib/billing/types";
import { generateInvoicePDF } from "@/lib/billing/pdf";
import PaymentHistory from "../_components/PaymentHistory";

const STATUS_COLORS: Record<BillingStatus, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  sent: "bg-blue-500/20 text-blue-400",
  active: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  paid: "bg-emerald-500/20 text-emerald-400",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<BillingCustomer | null>(null);
  const [payments, setPayments] = useState<readonly BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

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
        className="flex items-center gap-1 text-brand-muted hover:text-foreground text-sm mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Billing
      </button>

      {/* Customer Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={bentoChild}
        className="rounded-ios-lg bg-surface border border-separator p-6 mb-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {customer.company_name}
            </h1>
            {customer.description && (
              <p className="text-brand-muted text-sm">{customer.description}</p>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
              Amount
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatAmount(customer.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
              Type
            </p>
            <p className="text-sm font-medium text-foreground">
              {customer.recurring ? (
                <span className="text-accent">Recurring</span>
              ) : (
                "One-time"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
              Total Paid
            </p>
            <p className="text-lg font-bold text-emerald-400">
              {formatAmount(totalPaid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
              Outstanding
            </p>
            <p
              className={`text-lg font-bold ${
                outstanding > 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {formatAmount(Math.max(0, outstanding))}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex gap-4 text-sm text-brand-muted mb-6">
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

        {/* Contract status */}
        {customer.contract_enabled && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-brand-muted">Contract:</span>
            {customer.contract_signed ? (
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                Signed by {customer.contract_signed_by}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                Awaiting signature
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSendRequest}
            className="px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-foreground text-sm font-medium transition-colors"
          >
            Send Request
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
      </motion.div>

      {/* Payment History */}
      <motion.div initial="hidden" animate="visible" variants={bentoChild}>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Payments & Receipts
        </h2>
        <PaymentHistory payments={payments} />
      </motion.div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-accent text-foreground text-sm font-medium shadow-ios-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
