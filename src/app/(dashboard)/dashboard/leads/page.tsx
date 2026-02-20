"use client";

import { useEffect, useState, useCallback } from "react";
import type { Lead } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import { LeadDetailModal } from "@/components/leads/LeadDetailModal";
import { useNewLeadNotification } from "@/hooks/useNewLeadNotification";
import { NotificationDot } from "@/components/ui/NotificationDot";

export default function LeadsPage() {
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  const hasNewLeads = useNewLeadNotification(fetchLeads);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = useCallback((updated: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
    fetch("/api/marketing/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.error("Failed to persist lead update:", err));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    fetch(`/api/marketing/leads?id=${id}`, { method: "DELETE" })
      .catch((err) => console.error("Failed to delete lead:", err));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center gap-2 text-brand-muted text-sm">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading leads...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          type="button"
          onClick={fetchLeads}
          className="mt-3 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            {hasNewLeads && (
              <span className="relative w-2.5 h-2.5">
                <NotificationDot />
              </span>
            )}
          </div>
          <p className="text-brand-muted text-sm mt-1">
            {leads.length} total · Click any lead to view details
          </p>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 border border-brand-border rounded-xl">
          <svg className="w-12 h-12 mx-auto text-brand-muted/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="text-brand-muted text-sm">No leads yet. They&apos;ll appear here when someone submits the contact form.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-brand-border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-border/10">
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider hidden lg:table-cell">Project</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 text-xs uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="border-b border-brand-border/50 hover:bg-accent-blue/5 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                        <span className="text-accent-blue font-semibold text-xs">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-white font-medium group-hover:text-accent-blue transition-colors block truncate">
                          {lead.name}
                        </span>
                        {lead.company && (
                          <span className="text-[10px] text-brand-muted/60 truncate block">
                            {lead.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-muted truncate max-w-[200px]">{lead.email}</td>
                  <td className="px-4 py-3 text-brand-muted hidden md:table-cell">{lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-brand-muted hidden lg:table-cell truncate max-w-[150px]">{lead.project_interest ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs hidden sm:table-cell whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    <span className="text-brand-muted/60">
                      {new Date(lead.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onSave={updateLead}
        onDelete={deleteLead}
      />
    </div>
  );
}

function StatusBadge({ status }: { readonly status: string }) {
  const config = LEAD_STATUS_CONFIG.find((s) => s.value === status);
  const color = config?.color ?? "blue";

  const styles: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[color] ?? styles.blue}`}>
      {config?.label ?? status}
    </span>
  );
}
