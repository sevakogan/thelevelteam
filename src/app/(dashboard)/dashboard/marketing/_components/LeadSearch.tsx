"use client";

import { useState, useCallback } from "react";
import type { LeadStatus } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";

export interface LeadSearchFilters {
  readonly query: string;
  readonly status: LeadStatus | "all";
}

const EMPTY_FILTERS: LeadSearchFilters = { query: "", status: "all" };

interface LeadSearchProps {
  readonly filters: LeadSearchFilters;
  readonly onChange: (filters: LeadSearchFilters) => void;
  readonly resultCount: number;
  readonly totalCount: number;
}

export { EMPTY_FILTERS };

export function LeadSearch({ filters, onChange, resultCount, totalCount }: LeadSearchProps) {
  const [focused, setFocused] = useState(false);
  const hasFilters = filters.query.length > 0 || filters.status !== "all";

  const handleQueryChange = useCallback(
    (query: string) => onChange({ ...filters, query }),
    [filters, onChange]
  );

  const handleStatusChange = useCallback(
    (status: LeadStatus | "all") => onChange({ ...filters, status }),
    [filters, onChange]
  );

  const clearAll = useCallback(() => onChange(EMPTY_FILTERS), [onChange]);

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden bg-brand-border/5">
      <div className="px-3 py-2.5 flex items-center gap-3">
        {/* Search icon */}
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${
            focused ? "text-accent-blue" : "text-brand-muted/40"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        {/* Search input */}
        <input
          type="text"
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by name, phone, or email..."
          className="flex-1 text-sm text-white bg-transparent outline-none placeholder:text-brand-muted/40"
        />

        {/* Result count badge */}
        {hasFilters && (
          <span className="text-[10px] text-brand-muted shrink-0">
            {resultCount} of {totalCount}
          </span>
        )}

        {/* Clear button */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] text-brand-muted/60 hover:text-white transition-colors shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto">
        <StatusPill
          label="All"
          active={filters.status === "all"}
          onClick={() => handleStatusChange("all")}
        />
        {LEAD_STATUS_CONFIG.map((s) => (
          <StatusPill
            key={s.value}
            label={s.label}
            color={s.color}
            active={filters.status === s.value}
            onClick={() => handleStatusChange(s.value)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

const STATUS_PILL_COLORS: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  gray: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

function StatusPill({
  label,
  color,
  active,
  onClick,
}: {
  readonly label: string;
  readonly color?: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  const activeStyle = color
    ? STATUS_PILL_COLORS[color] ?? STATUS_PILL_COLORS.blue
    : "bg-white/10 text-white border-white/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors whitespace-nowrap ${
        active
          ? activeStyle
          : "text-brand-muted/40 border-brand-border/30 hover:border-brand-muted/40 hover:text-brand-muted/60"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Filter logic (exported for use in page) ─────────────────────────────────

export function filterLeads<T extends { readonly name: string; readonly phone: string; readonly email: string; readonly status: string }>(
  leads: readonly T[],
  filters: LeadSearchFilters
): readonly T[] {
  const q = filters.query.toLowerCase().trim();

  return leads.filter((lead) => {
    // Status filter
    if (filters.status !== "all" && lead.status !== filters.status) {
      return false;
    }

    // Text search across name, phone, email
    if (q.length > 0) {
      const matchesName = lead.name.toLowerCase().includes(q);
      const matchesPhone = lead.phone.toLowerCase().includes(q);
      const matchesEmail = lead.email.toLowerCase().includes(q);
      if (!matchesName && !matchesPhone && !matchesEmail) {
        return false;
      }
    }

    return true;
  });
}
