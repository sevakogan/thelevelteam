"use client";

import { useState } from "react";
import type { BillingCustomer } from "@/lib/billing/types";

interface CancellationAction {
  readonly action: "approve" | "decline" | "discount";
  readonly note?: string;
  readonly discountType?: "percent" | "fixed";
  readonly discountValue?: number;
}

interface CancellationModalProps {
  readonly customer: BillingCustomer;
  readonly onAction: (action: CancellationAction) => Promise<void>;
  readonly onClose: () => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
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

type Step = "overview" | "approve_confirm" | "decline_form" | "discount_form";

export default function CancellationModal({
  customer,
  onAction,
  onClose,
}: CancellationModalProps) {
  const [step, setStep] = useState<Step>("overview");
  const [note, setNote] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function execute(action: CancellationAction) {
    setLoading(true);
    try {
      await onAction(action);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const discountNumeric = parseFloat(discountValue);
  const isValidDiscount = !isNaN(discountNumeric) && discountNumeric > 0;

  const newAmount = isValidDiscount
    ? discountType === "percent"
      ? Math.max(0, customer.amount * (1 - discountNumeric / 100))
      : Math.max(0, customer.amount - discountNumeric)
    : null;

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
            <h2 className="text-foreground font-semibold">Handle Cancellation</h2>
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
        <div className="px-5 py-5 space-y-4">

          {/* Overview */}
          {step === "overview" && (
            <>
              {/* Reason card */}
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Customer Reason</p>
                <p className="text-foreground text-sm">
                  {customer.cancellation_reason ?? "No reason provided."}
                </p>
                <p className="text-brand-muted text-xs mt-2">
                  Requested: {formatDateTime(customer.cancellation_requested_at)}
                </p>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-ios-fill-tertiary p-3">
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Monthly Amount</p>
                  <p className="text-foreground font-semibold">{formatAmount(customer.amount)}</p>
                </div>
                <div className="rounded-lg bg-ios-fill-tertiary p-3">
                  <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">Contact</p>
                  <p className="text-foreground text-sm truncate">{customer.email || customer.phone || "—"}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setStep("approve_confirm")}
                  className="w-full py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  Approve &amp; Cancel Subscription
                </button>
                <button
                  onClick={() => setStep("discount_form")}
                  className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
                >
                  Offer Discount
                </button>
                <button
                  onClick={() => setStep("decline_form")}
                  className="w-full py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
                >
                  Decline Request
                </button>
              </div>
            </>
          )}

          {/* Approve confirmation */}
          {step === "approve_confirm" && (
            <>
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
                <p className="text-red-400 font-semibold mb-1">Confirm Cancellation</p>
                <p className="text-brand-muted text-sm">
                  This will cancel the Stripe subscription and mark the account as Lost. This cannot be undone.
                </p>
              </div>
              <div>
                <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">
                  Note to customer (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Thank you for your business..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm placeholder:text-brand-muted focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("overview")}
                  className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => execute({ action: "approve", note: note.trim() || undefined })}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Cancel"}
                </button>
              </div>
            </>
          )}

          {/* Decline form */}
          {step === "decline_form" && (
            <>
              <p className="text-foreground text-sm">
                The customer will be notified that their cancellation request was declined and the subscription continues.
              </p>
              <div>
                <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">
                  Message to customer (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. We'd love to keep working with you..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm placeholder:text-brand-muted focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("overview")}
                  className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => execute({ action: "decline", note: note.trim() || undefined })}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Decline Request"}
                </button>
              </div>
            </>
          )}

          {/* Discount form */}
          {step === "discount_form" && (
            <>
              <p className="text-foreground text-sm">
                Offer the customer a discounted rate to retain their subscription.
              </p>

              <div className="space-y-3">
                {/* Discount type */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiscountType("percent")}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      discountType === "percent"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-separator text-brand-muted hover:text-foreground"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setDiscountType("fixed")}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      discountType === "fixed"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-separator text-brand-muted hover:text-foreground"
                    }`}
                  >
                    Fixed ($)
                  </button>
                </div>

                {/* Discount value */}
                <div>
                  <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">
                    {discountType === "percent" ? "Discount Percentage" : "Discount Amount"}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percent" ? "e.g. 20" : "e.g. 50"}
                    min="0"
                    max={discountType === "percent" ? "100" : undefined}
                    className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm placeholder:text-brand-muted focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Preview */}
                {newAmount !== null && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex justify-between items-center">
                    <span className="text-brand-muted text-sm">New monthly amount</span>
                    <span className="text-ios-green font-semibold">{formatAmount(newAmount)}</span>
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="block text-xs text-brand-muted uppercase tracking-wider mb-1.5">
                    Message to customer (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. We value your business and want to make this work..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm placeholder:text-brand-muted focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("overview")}
                  className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() =>
                    execute({
                      action: "discount",
                      discountType,
                      discountValue: discountNumeric,
                      note: note.trim() || undefined,
                    })
                  }
                  disabled={loading || !isValidDiscount}
                  className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Apply Discount"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
