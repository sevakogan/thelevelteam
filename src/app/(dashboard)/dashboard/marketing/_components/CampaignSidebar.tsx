"use client";

import { useState, useCallback } from "react";
import type { Campaign } from "./types";
import { PlusIcon, MegaphoneIcon, GripIcon } from "./icons";
import { ChannelBadge } from "./ChannelBadge";

interface CampaignSidebarProps {
  readonly campaigns: readonly Campaign[];
  readonly activeCampaignId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onAdd: () => void;
  readonly onDelete: (id: string) => void;
  readonly onReorder: (campaigns: readonly Campaign[]) => void;
}

export function CampaignSidebar({
  campaigns,
  activeCampaignId,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
}: CampaignSidebarProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (dragIdx !== null && idx !== dragIdx) {
        setDragOverIdx(idx);
      }
    },
    [dragIdx]
  );

  const handleDrop = useCallback(
    (dropIdx: number) => {
      if (dragIdx === null || dragIdx === dropIdx) {
        setDragIdx(null);
        setDragOverIdx(null);
        return;
      }
      const reordered = [...campaigns];
      const [moved] = reordered.splice(dragIdx, 1);
      reordered.splice(dropIdx, 0, moved);
      onReorder(reordered);
      setDragIdx(null);
      setDragOverIdx(null);
    },
    [dragIdx, campaigns, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setDragOverIdx(null);
  }, []);

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="w-4 h-4 text-accent-blue" />
          <span className="text-sm text-white font-medium">Campaigns</span>
          <span className="text-xs text-brand-muted">{campaigns.length}</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      <div className="divide-y divide-brand-border/50">
        {campaigns.map((campaign, idx) => {
          const isActive = campaign.id === activeCampaignId;
          const isDragging = dragIdx === idx;
          const isDragOver = dragOverIdx === idx;

          return (
            <div
              key={campaign.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-1 transition-all ${
                isDragging ? "opacity-30" : ""
              } ${isDragOver ? "border-t-2 border-t-accent-blue" : ""}`}
            >
              {/* Drag handle */}
              <div className="pl-2 cursor-grab active:cursor-grabbing shrink-0 self-stretch flex items-center">
                <GripIcon className="w-3.5 h-3.5 text-brand-muted/40 hover:text-brand-muted/70 transition-colors" />
              </div>

              {/* Campaign row */}
              <button
                type="button"
                onClick={() => onSelect(campaign.id)}
                className={`flex-1 text-left px-2 py-3 flex items-center gap-3 transition-colors group ${
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
                      {(() => {
                        const count = campaign.channel === "both"
                          ? campaign.smsSteps.length + campaign.emailSteps.length
                          : campaign.steps.length;
                        return `${count} ${count === 1 ? "step" : "steps"}`;
                      })()}
                    </span>
                  </div>
                </div>
                {campaigns.length > 1 && (
                  <button
                    type="button"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
