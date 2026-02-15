"use client";

import type { Campaign } from "./types";
import { PlusIcon, MegaphoneIcon } from "./icons";
import { ChannelBadge } from "./ChannelBadge";

interface CampaignSidebarProps {
  readonly campaigns: readonly Campaign[];
  readonly activeCampaignId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onAdd: () => void;
  readonly onDelete: (id: string) => void;
}

export function CampaignSidebar({
  campaigns,
  activeCampaignId,
  onSelect,
  onAdd,
  onDelete,
}: CampaignSidebarProps) {
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="w-4 h-4 text-accent-blue" />
          <span className="text-sm text-white font-medium">Campaigns</span>
          <span className="text-xs text-brand-muted">{campaigns.length}</span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      <div className="divide-y divide-brand-border/50">
        {campaigns.map((campaign) => {
          const isActive = campaign.id === activeCampaignId;
          return (
            <button
              key={campaign.id}
              onClick={() => onSelect(campaign.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${
                isActive
                  ? "bg-accent-blue/5 border-l-2 border-l-accent-blue"
                  : "hover:bg-brand-border/10 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-brand-muted"}`}>
                    {campaign.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChannelBadge channel={campaign.channel} />
                  <span className="text-[10px] text-brand-muted">
                    {campaign.steps.length} {campaign.steps.length === 1 ? "step" : "steps"}
                  </span>
                </div>
              </div>
              {campaigns.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(campaign.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-brand-muted hover:text-red-400 transition-all p-1"
                  title="Delete campaign"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
