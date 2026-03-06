"use client";

import type { BillingPayment, PaymentStatus } from "@/lib/billing/types";

interface PaymentHistoryProps {
  readonly payments: readonly BillingPayment[];
}

const STATUS_COLORS: Record<PaymentStatus, string> = {
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-yellow-500/20 text-yellow-400",
  pending: "bg-blue-500/20 text-blue-400",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl bg-brand-dark border border-brand-border p-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-brand-muted mx-auto mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
        </div>
        <p className="text-brand-muted text-sm">No payments yet</p>
      </div>
    );
  }

  const totalCompleted = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments
    .filter((p) => p.status === "failed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-brand-dark border border-brand-border p-4">
          <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
            Total Received
          </p>
          <p className="text-lg font-bold text-emerald-400">
            {formatAmount(totalCompleted)}
          </p>
        </div>
        {totalFailed > 0 && (
          <div className="rounded-xl bg-brand-dark border border-brand-border p-4">
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
              Failed
            </p>
            <p className="text-lg font-bold text-red-400">
              {formatAmount(totalFailed)}
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-brand-dark border border-brand-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Date
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden sm:table-cell">
                Method
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-b border-brand-border/50 last:border-0"
              >
                <td className="px-4 py-3 text-white text-sm">
                  {formatDate(p.paid_at)}
                </td>
                <td className="px-4 py-3 text-right text-white text-sm font-medium">
                  {formatAmount(p.amount)}
                </td>
                <td className="px-4 py-3 text-brand-muted text-sm hidden sm:table-cell">
                  {p.method}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[p.status]
                    }`}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
