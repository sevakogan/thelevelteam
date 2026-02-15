"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Campaign, ChannelType, FlowStep } from "./types";
import { createStep } from "./types";
import { PlusIcon, GripIcon, PencilIcon, TrashIcon } from "./icons";
import { ChannelBadge } from "./ChannelBadge";

interface CampaignEditorProps {
  readonly campaign: Campaign;
  readonly onUpdate: (updated: Campaign) => void;
}

const CHANNEL_OPTIONS: readonly { value: ChannelType; label: string }[] = [
  { value: "sms", label: "SMS Only" },
  { value: "email", label: "Email Only" },
  { value: "both", label: "SMS + Email" },
];

export function CampaignEditor({ campaign, onUpdate }: CampaignEditorProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);

  const updateName = useCallback(
    (name: string) => onUpdate({ ...campaign, name }),
    [campaign, onUpdate]
  );

  const updateChannel = useCallback(
    (channel: ChannelType) => onUpdate({ ...campaign, channel }),
    [campaign, onUpdate]
  );

  const updateStep = useCallback(
    (stepId: string, field: keyof FlowStep, value: string) => {
      const steps = campaign.steps.map((s) =>
        s.id === stepId ? { ...s, [field]: value } : s
      );
      onUpdate({ ...campaign, steps });
    },
    [campaign, onUpdate]
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      const steps = campaign.steps.filter((s) => s.id !== stepId);
      onUpdate({ ...campaign, steps });
      setEditingStepId(null);
    },
    [campaign, onUpdate]
  );

  const addStep = useCallback(() => {
    const newStep = createStep("New Step", "Day ?", "Enter your message here...");
    onUpdate({ ...campaign, steps: [...campaign.steps, newStep] });
    setEditingStepId(newStep.id);
  }, [campaign, onUpdate]);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      setDragOverIndex(index);
    },
    [dragIndex]
  );

  const handleDrop = useCallback(
    (dropIndex: number) => {
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }

      const steps = [...campaign.steps];
      const [moved] = steps.splice(dragIndex, 1);
      steps.splice(dropIndex, 0, moved);
      onUpdate({ ...campaign, steps });
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [campaign, dragIndex, onUpdate]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const channelColor =
    campaign.channel === "sms"
      ? "green"
      : campaign.channel === "email"
      ? "blue"
      : "purple";

  const dotBg =
    channelColor === "green"
      ? "bg-green-400"
      : channelColor === "blue"
      ? "bg-accent-blue"
      : "bg-purple-400";

  const dotRing =
    channelColor === "green"
      ? "ring-green-400/20"
      : channelColor === "blue"
      ? "ring-accent-blue/20"
      : "ring-purple-400/20";

  const lineBg =
    channelColor === "green"
      ? "bg-green-400/20"
      : channelColor === "blue"
      ? "bg-accent-blue/20"
      : "bg-purple-400/20";

  const delayBg =
    channelColor === "green"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : channelColor === "blue"
      ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
      : "bg-purple-500/10 text-purple-400 border-purple-500/20";

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      {/* Campaign header */}
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10">
        <div className="flex items-center justify-between mb-3">
          {editingName ? (
            <input
              ref={nameRef}
              type="text"
              value={campaign.name}
              onChange={(e) => updateName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
              className="text-lg font-bold text-white bg-transparent border-b border-accent-blue outline-none py-0.5"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-2 group"
            >
              <h2 className="text-lg font-bold text-white">{campaign.name}</h2>
              <PencilIcon className="w-3.5 h-3.5 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Channel selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted mr-1">Channel:</span>
          {CHANNEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateChannel(opt.value)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                campaign.channel === opt.value
                  ? opt.value === "sms"
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : opt.value === "email"
                    ? "bg-accent-blue/10 text-accent-blue border-accent-blue/30"
                    : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                  : "text-brand-muted border-brand-border hover:border-brand-muted/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flow steps */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ChannelBadge channel={campaign.channel} />
            Automation Flow
          </h3>
          <button
            onClick={addStep}
            className="flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors px-3 py-1.5 rounded-lg border border-brand-border hover:border-accent-blue/40"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>

        <div className="relative">
          {campaign.steps.map((step, index) => {
            const isLast = index === campaign.steps.length - 1;
            const isDragging = dragIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={step.id}
                draggable={editingStepId !== step.id}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`flex gap-3 transition-all ${
                  isDragging ? "opacity-30" : ""
                } ${isDragOver ? "translate-y-1" : ""}`}
              >
                {/* Drag handle + timeline */}
                <div className="flex items-start gap-1 shrink-0">
                  {editingStepId !== step.id && (
                    <div className="pt-0.5 cursor-grab active:cursor-grabbing">
                      <GripIcon className="w-4 h-4 text-brand-muted/30 hover:text-brand-muted transition-colors" />
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${dotBg} ring-4 ${dotRing} shrink-0`} />
                    {!isLast && (
                      <div className={`w-0.5 flex-1 ${lineBg} min-h-[48px]`} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="pb-5 flex-1 min-w-0">
                  {isDragOver && dragIndex !== null && (
                    <div className="h-0.5 bg-accent-blue rounded-full mb-2 -mt-1" />
                  )}

                  {editingStepId === step.id ? (
                    <StepForm
                      step={step}
                      onUpdate={updateStep}
                      onDone={() => setEditingStepId(null)}
                      onDelete={() => deleteStep(step.id)}
                      canDelete={campaign.steps.length > 1}
                      delayBg={delayBg}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingStepId(step.id)}
                      className="w-full text-left group rounded-lg p-2 -m-2 hover:bg-brand-border/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-white font-medium">
                          {step.label}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0 rounded-full border font-medium ${delayBg}`}>
                          {step.delay}
                        </span>
                        <PencilIcon className="w-3 h-3 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        {step.description}
                      </p>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {campaign.steps.length === 0 && (
          <div className="text-center py-8">
            <p className="text-brand-muted text-sm mb-3">No steps yet</p>
            <button
              onClick={addStep}
              className="text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
            >
              + Add your first step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepForm({
  step,
  onUpdate,
  onDone,
  onDelete,
  canDelete,
  delayBg,
}: {
  readonly step: FlowStep;
  readonly onUpdate: (id: string, field: keyof FlowStep, value: string) => void;
  readonly onDone: () => void;
  readonly onDelete: () => void;
  readonly canDelete: boolean;
  readonly delayBg: string;
}) {
  const labelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    labelRef.current?.focus();
  }, []);

  return (
    <div className="rounded-lg border border-accent-blue/30 bg-brand-border/10 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={labelRef}
          type="text"
          value={step.label}
          onChange={(e) => onUpdate(step.id, "label", e.target.value)}
          className="flex-1 text-sm text-white font-medium bg-transparent border-b border-brand-border focus:border-accent-blue outline-none px-0 py-0.5"
          placeholder="Step name"
        />
        <input
          type="text"
          value={step.delay}
          onChange={(e) => onUpdate(step.id, "delay", e.target.value)}
          className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium bg-transparent outline-none w-20 text-center ${delayBg}`}
          placeholder="Day ?"
        />
      </div>

      <textarea
        value={step.description}
        onChange={(e) => onUpdate(step.id, "description", e.target.value)}
        rows={2}
        className="w-full text-xs text-brand-muted leading-relaxed bg-transparent border border-brand-border rounded-md px-2 py-1.5 focus:border-accent-blue outline-none resize-none"
        placeholder="Message content..."
      />

      <div className="flex items-center justify-between">
        {canDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="w-3 h-3" />
            Delete
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={onDone}
          className="text-[11px] font-medium text-accent-blue hover:text-accent-purple transition-colors px-3 py-1 rounded-md border border-brand-border hover:border-accent-blue/40"
        >
          Done
        </button>
      </div>
    </div>
  );
}
