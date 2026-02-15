"use client";

import type { Lead } from "@/lib/marketing/types";
import { SmsIcon, EmailIcon } from "./icons";

interface LeadsListProps {
  readonly leads: readonly Lead[];
  readonly selectedIds: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
  readonly onToggleAll: () => void;
}

export function LeadsList({ leads, selectedIds, onToggle, onToggleAll }: LeadsListProps) {
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={leads.length > 0 && selectedIds.size === leads.length}
            indeterminate={selectedIds.size > 0 && selectedIds.size < leads.length}
            onChange={onToggleAll}
          />
          <span className="text-sm text-white font-medium">Clients</span>
          <span className="text-xs text-brand-muted">{leads.length} total</span>
        </div>
        {selectedIds.size > 0 && (
          <span className="text-xs text-accent-blue font-medium">
            {selectedIds.size} selected
          </span>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-brand-muted text-sm">
            No leads yet. They&apos;ll appear here when someone submits the contact form.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-brand-border/50 max-h-64 overflow-y-auto">
          {leads.map((lead) => (
            <label
              key={lead.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-border/10 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedIds.has(lead.id)}
                onChange={() => onToggle(lead.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium truncate">
                    {lead.name}
                  </span>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-brand-muted truncate">{lead.email}</span>
                  <span className="text-xs text-brand-muted hidden sm:inline">{lead.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {lead.sms_consent && <ConsentBadge channel="sms" />}
                {lead.email_consent && <ConsentBadge channel="email" />}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  readonly checked: boolean;
  readonly indeterminate?: boolean;
  readonly onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked || indeterminate
          ? "bg-accent-blue border-accent-blue"
          : "border-brand-muted/40 hover:border-brand-muted"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {indeterminate && !checked && <div className="w-2 h-0.5 bg-white rounded-full" />}
    </button>
  );
}

function StatusBadge({ status }: { readonly status: string }) {
  const styles: Record<string, string> = {
    new: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    converted: "bg-green-500/10 text-green-400 border-green-500/20",
    unsubscribed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-block px-1.5 py-0 rounded-full text-[10px] font-medium border ${
        styles[status] ?? styles.new
      }`}
    >
      {status}
    </span>
  );
}

function ConsentBadge({ channel }: { readonly channel: "sms" | "email" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
        channel === "sms"
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
      }`}
    >
      {channel === "sms" ? <SmsIcon className="w-2.5 h-2.5" /> : <EmailIcon className="w-2.5 h-2.5" />}
      {channel.toUpperCase()}
    </span>
  );
}
