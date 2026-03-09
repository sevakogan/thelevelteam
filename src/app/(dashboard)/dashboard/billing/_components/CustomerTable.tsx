"use client";

import { useState, useMemo, type JSX } from "react";
import { useRouter } from "next/navigation";
import type { BillingCustomer, BillingStatus } from "@/lib/billing/types";

interface CustomerTableProps {
  readonly customers: readonly BillingCustomer[];
  readonly searchQuery: string;
  readonly onToggleStatus: (customer: BillingCustomer) => void;
  readonly onShare: (customer: BillingCustomer) => void;
  readonly onDownload: (customer: BillingCustomer) => void;
  readonly onEdit: (customer: BillingCustomer) => void;
  readonly onDelete: (customer: BillingCustomer) => void;
  readonly onSendRequest: (customer: BillingCustomer) => void;
}

type SortField =
  | "company_name"
  | "job_name"
  | "description"
  | "amount"
  | "recurring"
  | "due_date"
  | "invoice_number"
  | "status";

type SortDirection = "asc" | "desc";

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

function getStatusColor(status: string): string {
  return STATUS_COLORS[status as BillingStatus] ?? "bg-ios-fill text-brand-muted";
}

const TAG_COLORS = [
  "bg-purple-500/15 text-purple-500",
  "bg-blue-500/15 text-ios-blue",
  "bg-orange-500/15 text-orange-500",
  "bg-pink-500/15 text-pink-500",
  "bg-teal-500/15 text-teal-500",
  "bg-yellow-500/15 text-yellow-600",
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
  if (!dateStr || status === "done" || status === "lost" || status === "paid") return false;
  return new Date(dateStr) < new Date();
}

function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function matchesSearch(customer: BillingCustomer, query: string): boolean {
  const q = query.toLowerCase();
  return (
    customer.company_name.toLowerCase().includes(q) ||
    customer.description.toLowerCase().includes(q) ||
    (customer.job_name?.toLowerCase().includes(q) ?? false) ||
    (customer.invoice_number?.toLowerCase().includes(q) ?? false) ||
    customer.notes.toLowerCase().includes(q) ||
    customer.tags.some((t) => t.toLowerCase().includes(q)) ||
    customer.email.toLowerCase().includes(q)
  );
}

function sortCustomers(
  customers: readonly BillingCustomer[],
  field: SortField,
  direction: SortDirection
): readonly BillingCustomer[] {
  return [...customers].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "company_name":
        cmp = a.company_name.localeCompare(b.company_name);
        break;
      case "job_name":
        cmp = (a.job_name ?? "").localeCompare(b.job_name ?? "");
        break;
      case "description":
        cmp = a.description.localeCompare(b.description);
        break;
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "recurring":
        cmp = Number(a.recurring) - Number(b.recurring);
        break;
      case "due_date":
        cmp =
          (a.due_date ? new Date(a.due_date).getTime() : 0) -
          (b.due_date ? new Date(b.due_date).getTime() : 0);
        break;
      case "invoice_number":
        cmp = (a.invoice_number ?? "").localeCompare(
          b.invoice_number ?? ""
        );
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });
}

function SortIcon({
  field,
  activeField,
  direction,
}: {
  readonly field: SortField;
  readonly activeField: SortField | null;
  readonly direction: SortDirection;
}) {
  if (activeField !== field) {
    return (
      <svg className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {direction === "asc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      )}
    </svg>
  );
}

export default function CustomerTable({
  customers,
  searchQuery,
  onToggleStatus,
  onShare,
  onDownload,
  onEdit,
  onDelete,
  onSendRequest,
}: CustomerTableProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAndSorted = useMemo(() => {
    const filtered = searchQuery
      ? customers.filter((c) => matchesSearch(c, searchQuery))
      : customers;

    if (!sortField) return filtered;
    return sortCustomers(filtered, sortField, sortDirection);
  }, [customers, searchQuery, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  if (filteredAndSorted.length === 0 && searchQuery) {
    return (
      <div className="rounded-ios-lg bg-surface p-8 text-center">
        <p className="text-brand-muted text-sm">
          No customers match &ldquo;{searchQuery}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-ios-lg bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-separator">
              <SortableHeader field="company_name" label="Customer" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              <SortableHeader field="job_name" label="Job" activeField={sortField} direction={sortDirection} onSort={handleSort} className="hidden lg:table-cell" />
              <SortableHeader field="description" label="Description" activeField={sortField} direction={sortDirection} onSort={handleSort} className="hidden xl:table-cell" />
              <SortableHeader field="amount" label="Price" activeField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
              <SortableHeader field="recurring" label="Type" activeField={sortField} direction={sortDirection} onSort={handleSort} align="center" />
              <SortableHeader field="due_date" label="Due" activeField={sortField} direction={sortDirection} onSort={handleSort} className="hidden md:table-cell" />
              <SortableHeader field="invoice_number" label="Invoice #" activeField={sortField} direction={sortDirection} onSort={handleSort} className="hidden md:table-cell" />
              <th className="text-left px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">
                Tags
              </th>
              <SortableHeader field="status" label="Status" activeField={sortField} direction={sortDirection} onSort={handleSort} align="center" />
              <th className="text-right px-4 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/dashboard/billing/${c.id}`)}
                className="border-b border-separator hover:bg-ios-fill-tertiary cursor-pointer transition-colors"
              >
                {/* Customer */}
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

                {/* Job */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  {c.job_name ? (
                    <span className="text-foreground text-sm">{c.job_name}</span>
                  ) : (
                    <span className="text-brand-muted text-sm">—</span>
                  )}
                </td>

                {/* Description */}
                <td className="px-4 py-3 text-brand-muted text-sm hidden xl:table-cell max-w-[180px] truncate">
                  {c.description || "—"}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right text-foreground text-sm font-medium">
                  {formatAmount(c.amount)}
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-center">
                  {c.recurring ? (
                    <span className="text-xs font-medium text-accent">
                      Recurring
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">One-time</span>
                  )}
                </td>

                {/* Due Date */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span
                    className={`text-sm ${
                      isOverdue(c.due_date, c.status)
                        ? "text-ios-red font-medium"
                        : "text-brand-muted"
                    }`}
                  >
                    {formatDate(c.due_date)}
                  </span>
                </td>

                {/* Invoice # */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-brand-muted font-mono">
                    {c.invoice_number ?? "—"}
                  </span>
                </td>

                {/* Tags */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getTagColor(i)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {c.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-ios-fill text-brand-muted">
                        +{c.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                    {c.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === c.id ? null : c.id);
                      }}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                      </svg>
                    </button>
                    {openMenu === c.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); }} />
                        <div className="absolute right-0 top-8 z-20 w-52 rounded-xl bg-surface border border-separator shadow-ios-xl py-1.5">
                          <MenuItem icon="send" label="Send Request" onClick={() => { setOpenMenu(null); onSendRequest(c); }} />
                          <MenuItem icon="link" label="Share Link" onClick={() => { setOpenMenu(null); onShare(c); }} />
                          <MenuItem icon="pdf" label="Download PDF" onClick={() => { setOpenMenu(null); onDownload(c); }} />
                          <MenuItem icon="edit" label="Edit" onClick={() => { setOpenMenu(null); onEdit(c); }} />
                          <MenuItem
                            icon={c.status === "in_process" || c.status === "done" ? "cancel" : "activate"}
                            label={c.status === "in_process" || c.status === "done" ? "Cancel" : "Activate"}
                            onClick={() => { setOpenMenu(null); onToggleStatus(c); }}
                          />
                          <div className="h-px bg-separator mx-2 my-1.5" />
                          <MenuItem icon="delete" label="Delete" danger onClick={() => { setOpenMenu(null); onDelete(c); }} />
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

// ─── Sub-components ────────────────────────────────────

function SortableHeader({
  field,
  label,
  activeField,
  direction,
  onSort,
  align = "left",
  className = "",
}: {
  readonly field: SortField;
  readonly label: string;
  readonly activeField: SortField | null;
  readonly direction: SortDirection;
  readonly onSort: (field: SortField) => void;
  readonly align?: "left" | "center" | "right";
  readonly className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-${align} text-xs font-medium text-brand-muted uppercase tracking-wider cursor-pointer select-none group ${className}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon field={field} activeField={activeField} direction={direction} />
      </span>
    </th>
  );
}

const MENU_ICONS: Record<string, JSX.Element> = {
  send: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
  link: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
  pdf: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
  edit: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>,
  activate: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>,
  cancel: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  delete: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
};

function MenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  readonly icon?: string;
  readonly label: string;
  readonly danger?: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2.5 ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary"
      }`}
    >
      {icon && MENU_ICONS[icon] && (
        <span className="shrink-0 opacity-70">{MENU_ICONS[icon]}</span>
      )}
      {label}
    </button>
  );
}
