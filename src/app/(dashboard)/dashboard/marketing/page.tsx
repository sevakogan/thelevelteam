"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Lead, LeadStatus, MessageLog } from "@/lib/marketing/types";
import type { Campaign } from "./_components/types";
import { createCampaign, createStep } from "./_components/types";
import { DEFAULT_CAMPAIGNS } from "./_components/defaults";
import { CampaignSidebar } from "./_components/CampaignSidebar";
import { CampaignEditor } from "./_components/CampaignEditor";
import { LeadsList } from "./_components/LeadsList";
import { LeadKanban, getDefaultColumns } from "./_components/LeadKanban";
import type { KanbanColumn } from "./_components/LeadKanban";
import { AddLeadModal } from "./_components/AddLeadModal";
import { AssignCampaignBar } from "./_components/AssignCampaignBar";
import { ComplianceNotice } from "./_components/ComplianceNotice";
import { LeadConversation } from "./_components/LeadConversation";
import { LeadSearch, EMPTY_FILTERS, filterLeads } from "./_components/LeadSearch";
import type { LeadSearchFilters } from "./_components/LeadSearch";
import { PlusIcon, MegaphoneIcon } from "./_components/icons";

type MarketingTab = "leads" | "campaigns";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>("leads");
  const [leads, setLeads] = useState<readonly Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<ReadonlySet<string>>(
    new Set()
  );
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<readonly Campaign[]>(DEFAULT_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(
    DEFAULT_CAMPAIGNS[0]?.id ?? null
  );
  const [showAddLead, setShowAddLead] = useState(false);
  const [kanbanColumns, setKanbanColumns] = useState<readonly KanbanColumn[]>(
    getDefaultColumns
  );
  const [messageLogs, setMessageLogs] = useState<readonly MessageLog[]>([]);
  const [searchFilters, setSearchFilters] = useState<LeadSearchFilters>(EMPTY_FILTERS);

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

  // ─── Lead operations (persisted via API) ─────────────
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

  const onLeadAdded = useCallback(() => {
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
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (focusedLeadId === id) setFocusedLeadId(null);
    fetch(`/api/marketing/leads?id=${id}`, { method: "DELETE" })
      .catch((err) => console.error("Failed to delete lead:", err));
  }, [focusedLeadId]);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status, updated_at: now }
          : l
      )
    );
    fetch("/api/marketing/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: leadId, status, updated_at: now }),
    }).catch((err) => console.error("Failed to persist status update:", err));
  }, []);

  // ─── Focus lead for conversation ──────────────────────
  const focusLead = useCallback((id: string) => {
    setFocusedLeadId((prev) => (prev === id ? null : id));
  }, []);

  const focusedLead = useMemo(
    () => leads.find((l) => l.id === focusedLeadId) ?? null,
    [leads, focusedLeadId]
  );

  const filteredLeads = useMemo(
    () => filterLeads(leads, searchFilters),
    [leads, searchFilters]
  );

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

  // ─── Campaign names map ──────────────────────────────
  const campaignNames = useMemo(
    () => new Map(campaigns.map((c) => [c.id, c.name])),
    [campaigns]
  );

  // ─── Assign campaigns to selected leads ─────────────
  const assignCampaigns = useCallback(
    (campaignIds: readonly string[]) => {
      setLeads((prev) =>
        prev.map((lead) => {
          if (!selectedLeadIds.has(lead.id)) return lead;
          const existing = new Set(lead.assigned_campaigns);
          for (const cid of campaignIds) {
            existing.add(cid);
          }
          return {
            ...lead,
            assigned_campaigns: Array.from(existing),
            updated_at: new Date().toISOString(),
          };
        })
      );
    },
    [selectedLeadIds]
  );

  const clearSelection = useCallback(() => {
    setSelectedLeadIds(new Set());
  }, []);

  // ─── Message log operations ──────────────────────────
  const addMessageLogs = useCallback((logs: readonly MessageLog[]) => {
    setMessageLogs((prev) => [...logs, ...prev]);
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
    <div className="space-y-6">
      {/* ─── Top Header ──────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketing</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage leads, pipeline, campaigns, and messaging
        </p>
      </div>

      {/* ─── Tab Navigation ──────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-brand-border">
        <div className="flex items-center gap-0 overflow-x-auto">
          <TabButton
            active={activeTab === "leads"}
            onClick={() => setActiveTab("leads")}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            label="Leads"
            count={leads.length}
          />
          <TabButton
            active={activeTab === "campaigns"}
            onClick={() => setActiveTab("campaigns")}
            icon={<MegaphoneIcon className="w-4 h-4" />}
            label="Campaigns"
            count={campaigns.length}
          />
        </div>

        {/* Context-aware action button */}
        {activeTab === "leads" && (
          <button
            type="button"
            onClick={() => setShowAddLead(true)}
            className="flex items-center gap-2 text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-accent-blue/20 mb-2 shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            Add a Lead
          </button>
        )}
        {activeTab === "campaigns" && (
          <button
            type="button"
            onClick={addCampaign}
            className="flex items-center gap-2 text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-accent-blue/20 mb-2 shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            New Campaign
          </button>
        )}
      </div>

      {/* ─── Leads Tab ───────────────────────────────────────── */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {/* Pipeline on top */}
          <LeadKanban
            leads={leads}
            onUpdateStatus={updateLeadStatus}
            onEditLead={(lead) => updateLead(lead)}
            columns={kanbanColumns}
            onUpdateColumns={setKanbanColumns}
          />

          {/* Search bar */}
          <LeadSearch
            filters={searchFilters}
            onChange={setSearchFilters}
            resultCount={filteredLeads.length}
            totalCount={leads.length}
          />

          {/* 2-column layout: Leads list (left) + Conversation (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
            {/* Left — leads list + assign bar */}
            <div className="space-y-4">
              <LeadsList
                leads={filteredLeads}
                selectedIds={selectedLeadIds}
                focusedId={focusedLeadId}
                onToggle={toggleLead}
                onToggleAll={toggleAll}
                onFocus={focusLead}
                onUpdateLead={updateLead}
                onDeleteLead={deleteLead}
                campaignNames={campaignNames}
                messageLogs={messageLogs}
              />

              <AssignCampaignBar
                selectedCount={selectedLeadIds.size}
                campaigns={campaigns}
                onAssign={assignCampaigns}
                onClear={clearSelection}
              />
            </div>

            {/* Right — conversation panel */}
            <LeadConversation
              lead={focusedLead}
              messageLogs={messageLogs}
              onSend={addMessageLogs}
              campaigns={campaigns}
              campaignNames={campaignNames}
            />
          </div>
        </div>
      )}

      {/* ─── Campaigns Tab ───────────────────────────────────── */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
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

          <ComplianceNotice />
        </div>
      )}

      {/* Add Lead modal */}
      <AddLeadModal
        open={showAddLead}
        onClose={() => setShowAddLead(false)}
        onAdd={onLeadAdded}
      />
    </div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative shrink-0 ${
        active
          ? "text-white"
          : "text-brand-muted hover:text-white"
      }`}
    >
      {icon}
      {label}
      {count > 0 && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            active
              ? "bg-accent-blue/20 text-accent-blue"
              : "bg-brand-border/50 text-brand-muted"
          }`}
        >
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-blue rounded-full" />
      )}
    </button>
  );
}
