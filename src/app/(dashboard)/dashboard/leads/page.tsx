"use client";

import { useEffect, useState, useCallback } from "react";
import type { Lead } from "@/lib/marketing/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/leads", {
        headers: { "x-admin-password": "" }, // Auth now handled by middleware/session
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-muted text-sm">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-brand-muted text-sm mt-1">
            {leads.length} total {leads.length === 1 ? "lead" : "leads"}
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
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted font-medium px-4 py-3">Name</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3">Email</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 hidden md:table-cell">Phone</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 hidden lg:table-cell">Project</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3">Status</th>
                <th className="text-left text-brand-muted font-medium px-4 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-brand-border/50 hover:bg-brand-border/10">
                  <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-brand-muted">{lead.email}</td>
                  <td className="px-4 py-3 text-brand-muted hidden md:table-cell">{lead.phone}</td>
                  <td className="px-4 py-3 text-brand-muted hidden lg:table-cell">{lead.project_interest ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs hidden sm:table-cell">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? styles.new}`}>
      {status}
    </span>
  );
}
