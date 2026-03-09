"use client";

import { useState } from "react";
import type { BillingPayment } from "@/lib/billing/types";

interface RefundModalProps {
  readonly payments: readonly BillingPayment[];
  readonly onRefund: (paymentId: string, amount: number) => Promise<void>;
  readonly onClose: () => void;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function RefundModal({ payments, onRefund, onClose }: RefundModalProps) {
  const refundable = payments.filter(
    (p) => p.status === "completed" && (p.stripe_payment_intent || p.stripe_session_id)
  );
  const [selectedId, setSelectedId] = useState<string>(refundable[0]?.id ?? "");
  const [amountType, setAmountType] = useState<"full" | "custom">("full");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = refundable.find((p) => p.id === selectedId);

  async function handleSubmit() {
    if (!selected) return;
    const amount = amountType === "full"
      ? selected.amount
      : parseFloat(customAmount);

    if (isNaN(amount) || amount <= 0 || amount > selected.amount) {
      setError(`Enter an amount between $0.01 and ${formatAmount(selected.amount)}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onRefund(selected.id, amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refund failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface rounded-ios-xl border border-separator shadow-ios-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-separator">
          <h2 className="text-base font-semibold text-foreground">Issue Refund</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {refundable.length === 0 && (
            <p className="text-brand-muted text-sm text-center py-4">
              No refundable payments. Only Stripe payments can be refunded automatically.
            </p>
          )}

          {refundable.length > 0 && (
            <>
              {/* Payment selector */}
              {refundable.length > 1 && (
                <div>
                  <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                    Select Payment
                  </label>
                  <div className="space-y-2">
                    {refundable.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedId === p.id
                            ? "border-accent bg-accent/10"
                            : "border-separator hover:bg-ios-fill-tertiary"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={p.id}
                          checked={selectedId === p.id}
                          onChange={() => setSelectedId(p.id)}
                          className="accent-accent"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{formatAmount(p.amount)}</p>
                          <p className="text-xs text-brand-muted">{p.method} · {formatDate(p.paid_at)}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount type */}
              {selected && (
                <div>
                  <label className="block text-xs text-brand-muted uppercase tracking-wider mb-2">
                    Refund Amount
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setAmountType("full")}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        amountType === "full"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-separator text-brand-muted hover:text-foreground"
                      }`}
                    >
                      Full — {formatAmount(selected.amount)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountType("custom")}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        amountType === "custom"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-separator text-brand-muted hover:text-foreground"
                      }`}
                    >
                      Custom Amount
                    </button>
                  </div>

                  {amountType === "custom" && (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">$</span>
                      <input
                        type="number"
                        min="0.01"
                        max={selected.amount}
                        step="0.01"
                        placeholder={selected.amount.toFixed(2)}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-7 pr-4 py-2.5 bg-ios-fill rounded-lg border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="text-ios-red text-sm">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-separator text-brand-muted text-sm hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selected}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {loading ? "Processing…" : "Issue Refund"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
