"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BillingCustomer, BillingStatus } from "@/lib/billing/types";

interface CustomerTableProps {
  readonly customers: readonly BillingCustomer[];
  readonly onToggleStatus: (customer: BillingCustomer) => void;
  readonly onShare: (customer: BillingCustomer) => void;
  readonly onDownload: (customer: BillingCustomer) => void;
  readonly onEdit: (customer: BillingCustomer) => void;
  readonly onDelete: (customer: BillingCustomer) => void;
  readonly onSendRequest: (customer: BillingCustomer) => void;
}

const STATUS_COLORS: Record<BillingStatus, string> = {
  draft: "bg-ios-fill text-brand-muted",
  sent: "bg-blue-500/15 text-ios-blue",
  active: "bg-green-500/15 text-ios-green",
  cancelled: "bg-red-500/15 text-ios-red",
  paid: "bg-green-500/15 text-ios-green",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CustomerTable({
  customers,
  onToggleStatus,
  onShare,
  onDownload,
  onEdit,
  onDelete,
  onSendRequest,
}: CustomerTableProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="rounded-ios-lg bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-separator">
              <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Recurring
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Subscribe
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/dashboard/billing/${c.id}`)}
                className="border-b border-separator hover:bg-ios-fill-tertiary cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-foreground text-sm font-medium">
                    {c.company_name}
                  </div>
                  {c.email && (
                    <div className="text-brand-muted text-xs mt-0.5">
                      {c.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-muted text-sm hidden md:table-cell max-w-[200px] truncate">
                  {c.description || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.recurring ? (
                    <span className="text-xs font-medium text-accent">
                      Yes
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-foreground text-sm font-medium">
                  {formatAmount(c.amount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(c);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      c.status === "active" || c.status === "paid"
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {c.status === "active" || c.status === "paid"
                      ? "Cancel"
                      : "Subscribe"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[c.status]
                    }`}
                  >
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === c.id ? null : c.id);
                      }}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
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
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </button>
                    {openMenu === c.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(null);
                          }}
                        />
                        <div className="absolute right-0 top-8 z-20 w-44 rounded-lg bg-surface border border-separator shadow-ios-lg py-1">
                          <MenuItem
                            label="Send Request"
                            onClick={() => {
                              setOpenMenu(null);
                              onSendRequest(c);
                            }}
                          />
                          <MenuItem
                            label="Share Link"
                            onClick={() => {
                              setOpenMenu(null);
                              onShare(c);
                            }}
                          />
                          <MenuItem
                            label="Download PDF"
                            onClick={() => {
                              setOpenMenu(null);
                              onDownload(c);
                            }}
                          />
                          <MenuItem
                            label="Edit"
                            onClick={() => {
                              setOpenMenu(null);
                              onEdit(c);
                            }}
                          />
                          <div className="h-px bg-separator my-1" />
                          <MenuItem
                            label="Delete"
                            danger
                            onClick={() => {
                              setOpenMenu(null);
                              onDelete(c);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MenuItem({
  label,
  danger,
  onClick,
}: {
  readonly label: string;
  readonly danger?: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary"
      }`}
    >
      {label}
    </button>
  );
}
