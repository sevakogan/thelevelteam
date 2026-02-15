"use client";

import { useEffect, useState, useCallback } from "react";
import type { Lead, LeadStatus } from "@/lib/marketing/types";
import type { Campaign } from "./_components/types";
import { createCampaign, createStep } from "./_components/types";
import { DEFAULT_CAMPAIGNS } from "./_components/defaults";
import { CampaignSidebar } from "./_components/CampaignSidebar";
import { CampaignEditor } from "./_components/CampaignEditor";
import { LeadsList } from "./_components/LeadsList";
import { LeadKanban, getDefaultColumns } from "./_components/LeadKanban";
import type { KanbanColumn } from "./_components/LeadKanban";
import { AddLeadModal } from "./_components/AddLeadModal";
import { ComplianceNotice } from "./_components/ComplianceNotice";
import { PlusIcon } from "./_components/icons";

export default function MarketingPage() {
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(
    new Set()
  );
  const [campaigns, setCampaigns] = useState<readonly Campaign[]>(DEFAULT_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(
    DEFAULT_CAMPAIGNS[0]?.id ?? null
  );
  const [showAddLead, setShowAddLead] = useState(false);
  const [kanbanColumns, setKanbanColumns] = useState<readonly KanbanColumn[]>(
    getDefaultColumns
  );

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

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ─── Lead operations ──────────────────────────────────
  const toggleLead = useCallback((id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedLeadIds((prev) => {
      if (prev.size === leads.length) return new Set();
      return new Set(leads.map((l) => l.id));
    });
  }, [leads]);

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
  }, []);

  const updateLead = useCallback((updated: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status, updated_at: new Date().toISOString() }
          : l
      )
    );
  }, []);

  // ─── Campaign operations ──────────────────────────────
  const addCampaign = useCallback(() => {
    const newCampaign = createCampaign(
      "New Campaign",
      "both",
      [createStep("Welcome", "Immediate", "Enter your welcome message here...")]
    );
    setCampaigns((prev) => [...prev, newCampaign]);
    setActiveCampaignId(newCampaign.id);
  }, []);

  const deleteCampaign = useCallback(
    (id: string) => {
      setCampaigns((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        if (activeCampaignId === id) {
          setActiveCampaignId(filtered[0]?.id ?? null);
        }
        return filtered;
      });
    },
    [activeCampaignId]
  );

  const updateCampaign = useCallback((updated: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }, []);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? null;

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-muted text-sm">Loading marketing data...</p>
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
    <div className="space-y-8">
      {/* Header + Add Lead button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <p className="text-brand-muted text-sm mt-1">
            Manage clients, pipeline, campaigns, and automation flows
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddLead(true)}
          className="flex items-center gap-2 text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-accent-blue/20"
        >
          <PlusIcon className="w-4 h-4" />
          Add a Lead
        </button>
      </div>

      {/* Clients list */}
      <LeadsList
        leads={leads}
        selectedIds={selectedLeadIds}
        onToggle={toggleLead}
        onToggleAll={toggleAll}
        onUpdateLead={updateLead}
      />

      {/* Kanban pipeline */}
      <LeadKanban
        leads={leads}
        onUpdateStatus={updateLeadStatus}
        onEditLead={(lead) => updateLead(lead)}
        columns={kanbanColumns}
        onUpdateColumns={setKanbanColumns}
      />

      {/* Campaigns: sidebar + editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <CampaignSidebar
          campaigns={campaigns}
          activeCampaignId={activeCampaignId}
          onSelect={setActiveCampaignId}
          onAdd={addCampaign}
          onDelete={deleteCampaign}
        />

        {activeCampaign ? (
          <CampaignEditor
            campaign={activeCampaign}
            onUpdate={updateCampaign}
          />
        ) : (
          <div className="border border-brand-border rounded-xl flex items-center justify-center py-20">
            <p className="text-brand-muted text-sm">
              Select or create a campaign to get started
            </p>
          </div>
        )}
      </div>

      {/* Legal & Compliance */}
      <ComplianceNotice />

      {/* Add Lead modal */}
      <AddLeadModal
        open={showAddLead}
        onClose={() => setShowAddLead(false)}
        onAdd={addLead}
      />
    </div>
  );
}
