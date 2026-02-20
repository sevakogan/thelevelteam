"use client";

/**
 * Pulsing green notification dot.
 * Used in DashboardNav and marketing LeadsList to indicate new leads.
 */
export function NotificationDot() {
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.4)]" />
    </span>
  );
}
