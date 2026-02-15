"use client";

import { useState, useCallback } from "react";
import type { Campaign } from "./types";
import { MegaphoneIcon } from "./icons";
import { ChannelBadge } from "./ChannelBadge";

interface AssignCampaignBarProps {
  readonly selectedCount: number;
  readonly campaigns: readonly Campaign[];
  readonly onAssign: (campaignIds: readonly string[]) => void;
  readonly onClear: () => void;
}

export function AssignCampaignBar({
  selectedCount,
  campaigns,
  onAssign,
  onClear,
}: AssignCampaignBarProps) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [confirmed, setConfirmed] = useState(false);

  const toggleCampaign = useCallback((id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAssign = useCallback(() => {
    if (picked.size === 0) return;
    onAssign(Array.from(picked));
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setOpen(false);
      setPicked(new Set());
      onClear();
    }, 1500);
  }, [picked, onAssign, onClear]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    setPicked(new Set());
  }, []);

  if (selectedCount === 0) return null;

  return (
    <div className="border border-accent-blue/30 bg-accent-blue/5 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white font-medium">
            {selectedCount} client{selectedCount !== 1 ? "s" : ""} selected
          </span>
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-white bg-accent-blue hover:bg-accent-blue/80 px-4 py-1.5 rounded-lg transition-colors"
            >
              <MegaphoneIcon className="w-3.5 h-3.5" />
              Assign Campaign
            </button>
          )}
        </div>
        {!open && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-brand-muted hover:text-white transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Campaign picker */}
      {open && (
        <div className="mt-3 pt-3 border-t border-accent-blue/20">
          {confirmed ? (
            <div className="flex items-center gap-2 py-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-400 font-medium">
                Assigned {picked.size} campaign{picked.size !== 1 ? "s" : ""} to {selectedCount} client{selectedCount !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <>
              <p className="text-xs text-brand-muted mb-2">
                Select campaigns to assign (can pick multiple):
              </p>
              <div className="space-y-1.5">
                {campaigns.map((campaign) => {
                  const isSelected = picked.has(campaign.id);
                  return (
                    <button
                      key={campaign.id}
                      type="button"
                      onClick={() => toggleCampaign(campaign.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                        isSelected
                          ? "border-accent-blue/40 bg-accent-blue/10"
                          : "border-brand-border/40 hover:border-brand-muted/40 bg-transparent"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-accent-blue border-accent-blue"
                            : "border-brand-muted/40"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white font-medium">
                          {campaign.name}
                        </span>
                      </div>

                      <ChannelBadge channel={campaign.channel} />

                      <span className="text-[10px] text-brand-muted shrink-0">
                        {campaign.channel === "both"
                          ? `${campaign.smsSteps.length + campaign.emailSteps.length} steps`
                          : `${campaign.steps.length} steps`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-brand-muted hover:text-white transition-colors px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={picked.size === 0}
                  className={`text-xs font-medium px-4 py-1.5 rounded-lg transition-colors ${
                    picked.size > 0
                      ? "text-white bg-accent-blue hover:bg-accent-blue/80"
                      : "text-brand-muted/40 bg-brand-border/30 cursor-not-allowed"
                  }`}
                >
                  Assign {picked.size > 0 ? `(${picked.size})` : ""}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
