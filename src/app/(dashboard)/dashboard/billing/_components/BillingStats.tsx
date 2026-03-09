"use client";

import type { BillingCustomer } from "@/lib/billing/types";

interface BillingStatsProps {
  readonly customers: readonly BillingCustomer[];
}

function fmt(n: number): string {
  if (n >= 1000) {
    return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const COLLECTED_STATUSES = new Set(["paid", "done", "in_process", "cancellation_requested"]);
const PENDING_STATUSES = new Set(["lead", "sent", "viewed"]);

export default function BillingStats({ customers }: BillingStatsProps) {
  if (customers.length === 0) return null;

  let collected = 0;
  let pending = 0;
  let mrr = 0;
  let activeCount = 0;
  let lostCount = 0;

  for (const c of customers) {
    if (COLLECTED_STATUSES.has(c.status)) {
      collected += c.amount;
      if (c.recurring && c.status === "in_process") {
        mrr += c.amount;
        activeCount++;
      }
    } else if (PENDING_STATUSES.has(c.status)) {
      pending += c.amount;
    } else if (c.status === "lost") {
      lostCount++;
    }
  }

  const stats = [
    {
      label: "Collected",
      value: fmt(collected),
      sub: `${customers.filter((c) => COLLECTED_STATUSES.has(c.status)).length} invoices`,
      color: "text-emerald-400",
      dot: "bg-emerald-400",
      bar: collected,
    },
    {
      label: "Pending",
      value: fmt(pending),
      sub: `${customers.filter((c) => PENDING_STATUSES.has(c.status)).length} awaiting`,
      color: "text-amber-400",
      dot: "bg-amber-400",
      bar: pending,
    },
    {
      label: "MRR",
      value: fmt(mrr),
      sub: `${activeCount} active`,
      color: "text-blue-400",
      dot: "bg-blue-400",
      bar: mrr,
    },
    {
      label: "Total",
      value: fmt(collected + pending + mrr),
      sub: `${customers.length} total`,
      color: "text-foreground",
      dot: "bg-ios-fill-secondary",
      bar: collected + pending,
    },
  ];

  const maxBar = Math.max(...stats.map((s) => s.bar), 1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="relative overflow-hidden rounded-ios-lg bg-surface border border-separator px-4 py-3.5"
        >
          {/* Mini progress bar at bottom */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-separator w-full" />
          <div
            className={`absolute bottom-0 left-0 h-[2px] ${s.dot} transition-all duration-700`}
            style={{ width: `${Math.round((s.bar / maxBar) * 100)}%` }}
          />

          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
            <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">
              {s.label}
            </span>
          </div>

          <p className={`text-[22px] font-semibold leading-none tracking-tight ${s.color} mb-1`}>
            {s.value}
          </p>
          <p className="text-[11px] text-brand-muted">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
