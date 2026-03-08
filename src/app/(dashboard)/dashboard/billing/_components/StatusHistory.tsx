"use client";

import type { StatusEntry } from "@/lib/billing/types";

interface StatusHistoryProps {
  readonly history: readonly StatusEntry[];
  readonly onClose: () => void;
}

function statusColor(status: string): string {
  switch (status) {
    case "lead":
      return "bg-ios-fill text-brand-muted";
    case "sent":
      return "bg-blue-500/15 text-blue-400";
    case "viewed":
      return "bg-purple-500/15 text-purple-400";
    case "paid":
      return "bg-green-500/15 text-ios-green";
    case "in_process":
      return "bg-blue-500/15 text-ios-blue";
    case "cancellation_requested":
      return "bg-red-500/15 text-red-400";
    case "done":
      return "bg-green-500/15 text-ios-green";
    case "lost":
      return "bg-red-500/15 text-ios-red";
    default:
      return "bg-ios-fill text-brand-muted";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "lead": return "Lead";
    case "sent": return "Sent";
    case "viewed": return "Viewed";
    case "paid": return "Paid";
    case "in_process": return "In Process";
    case "cancellation_requested": return "Cancellation Requested";
    case "done": return "Done";
    case "lost": return "Lost";
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function StatusHistory({ history, onClose }: StatusHistoryProps) {
  const sorted = [...history].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-ios-lg bg-surface border border-separator shadow-ios-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-separator">
          <h2 className="text-foreground font-semibold">Status History</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="max-h-[60vh] overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="px-5 py-10 text-center text-brand-muted text-sm">
              No status history recorded.
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {sorted.map((entry, i) => (
                <div key={`${entry.at}-${i}`} className="flex gap-3">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    {i < sorted.length - 1 && (
                      <div className="w-px flex-1 bg-separator mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(entry.status)}`}
                      >
                        {statusLabel(entry.status)}
                      </span>
                    </div>
                    <p className="text-brand-muted text-xs mt-1">
                      {formatDateTime(entry.at)}
                    </p>
                    {entry.note && (
                      <p className="text-foreground text-xs mt-1 leading-relaxed">
                        {entry.note}
                      </p>
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
    </div>
  );
}
