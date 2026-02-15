"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Campaign, ChannelType, FlowStep } from "./types";
import { createStep, switchCampaignChannel } from "./types";
import { PlusIcon, GripIcon, PencilIcon, TrashIcon, SmsIcon, EmailIcon } from "./icons";

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
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);

  const updateName = useCallback(
    (name: string) => onUpdate({ ...campaign, name }),
    [campaign, onUpdate]
  );

  const handleChannelChange = useCallback(
    (channel: ChannelType) => onUpdate(switchCampaignChannel(campaign, channel)),
    [campaign, onUpdate]
  );

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
              onClick={() => handleChannelChange(opt.value)}
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
        {campaign.channel === "both" ? (
          <SplitFlowEditor
            campaign={campaign}
            onUpdate={onUpdate}
            editingStepId={editingStepId}
            onEditStep={setEditingStepId}
          />
        ) : (
          <SingleFlowEditor
            campaign={campaign}
            onUpdate={onUpdate}
            editingStepId={editingStepId}
            onEditStep={setEditingStepId}
            channel={campaign.channel}
          />
        )}
      </div>
    </div>
  );
}

// ─── Split flow (side-by-side SMS + Email) ──────────────────────────────────

interface SplitFlowEditorProps {
  readonly campaign: Campaign;
  readonly onUpdate: (updated: Campaign) => void;
  readonly editingStepId: string | null;
  readonly onEditStep: (id: string | null) => void;
}

function SplitFlowEditor({ campaign, onUpdate, editingStepId, onEditStep }: SplitFlowEditorProps) {
  const updateSmsStep = useCallback(
    (stepId: string, field: keyof FlowStep, value: string) => {
      const smsSteps = campaign.smsSteps.map((s) =>
        s.id === stepId ? { ...s, [field]: value } : s
      );
      onUpdate({ ...campaign, smsSteps });
    },
    [campaign, onUpdate]
  );

  const updateEmailStep = useCallback(
    (stepId: string, field: keyof FlowStep, value: string) => {
      const emailSteps = campaign.emailSteps.map((s) =>
        s.id === stepId ? { ...s, [field]: value } : s
      );
      onUpdate({ ...campaign, emailSteps });
    },
    [campaign, onUpdate]
  );

  const deleteSmsStep = useCallback(
    (stepId: string) => {
      onUpdate({ ...campaign, smsSteps: campaign.smsSteps.filter((s) => s.id !== stepId) });
      onEditStep(null);
    },
    [campaign, onUpdate, onEditStep]
  );

  const deleteEmailStep = useCallback(
    (stepId: string) => {
      onUpdate({ ...campaign, emailSteps: campaign.emailSteps.filter((s) => s.id !== stepId) });
      onEditStep(null);
    },
    [campaign, onUpdate, onEditStep]
  );

  const addSmsStep = useCallback(() => {
    const step = createStep("New SMS Step", "Day ?", "Enter your SMS message...");
    onUpdate({ ...campaign, smsSteps: [...campaign.smsSteps, step] });
    onEditStep(step.id);
  }, [campaign, onUpdate, onEditStep]);

  const addEmailStep = useCallback(() => {
    const step = createStep("New Email Step", "Day ?", "Enter your email message...");
    onUpdate({ ...campaign, emailSteps: [...campaign.emailSteps, step] });
    onEditStep(step.id);
  }, [campaign, onUpdate, onEditStep]);

  const reorderSms = useCallback(
    (fromIndex: number, toIndex: number) => {
      const steps = [...campaign.smsSteps];
      const [moved] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, moved);
      onUpdate({ ...campaign, smsSteps: steps });
    },
    [campaign, onUpdate]
  );

  const reorderEmail = useCallback(
    (fromIndex: number, toIndex: number) => {
      const steps = [...campaign.emailSteps];
      const [moved] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, moved);
      onUpdate({ ...campaign, emailSteps: steps });
    },
    [campaign, onUpdate]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* SMS column */}
      <FlowColumn
        title="SMS Flow"
        icon={<SmsIcon className="w-4 h-4 text-green-400" />}
        steps={campaign.smsSteps}
        channel="sms"
        editingStepId={editingStepId}
        onEditStep={onEditStep}
        onUpdateStep={updateSmsStep}
        onDeleteStep={deleteSmsStep}
        onAddStep={addSmsStep}
        onReorder={reorderSms}
      />

      {/* Email column */}
      <FlowColumn
        title="Email Flow"
        icon={<EmailIcon className="w-4 h-4 text-accent-blue" />}
        steps={campaign.emailSteps}
        channel="email"
        editingStepId={editingStepId}
        onEditStep={onEditStep}
        onUpdateStep={updateEmailStep}
        onDeleteStep={deleteEmailStep}
        onAddStep={addEmailStep}
        onReorder={reorderEmail}
      />
    </div>
  );
}

// ─── Single flow (one channel) ──────────────────────────────────────────────

interface SingleFlowEditorProps {
  readonly campaign: Campaign;
  readonly onUpdate: (updated: Campaign) => void;
  readonly editingStepId: string | null;
  readonly onEditStep: (id: string | null) => void;
  readonly channel: "sms" | "email";
}

function SingleFlowEditor({
  campaign,
  onUpdate,
  editingStepId,
  onEditStep,
  channel,
}: SingleFlowEditorProps) {
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
      onUpdate({ ...campaign, steps: campaign.steps.filter((s) => s.id !== stepId) });
      onEditStep(null);
    },
    [campaign, onUpdate, onEditStep]
  );

  const addStep = useCallback(() => {
    const label = channel === "sms" ? "New SMS Step" : "New Email Step";
    const step = createStep(label, "Day ?", "Enter your message here...");
    onUpdate({ ...campaign, steps: [...campaign.steps, step] });
    onEditStep(step.id);
  }, [campaign, channel, onUpdate, onEditStep]);

  const reorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const steps = [...campaign.steps];
      const [moved] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, moved);
      onUpdate({ ...campaign, steps });
    },
    [campaign, onUpdate]
  );

  const icon =
    channel === "sms" ? (
      <SmsIcon className="w-4 h-4 text-green-400" />
    ) : (
      <EmailIcon className="w-4 h-4 text-accent-blue" />
    );

  const title = channel === "sms" ? "SMS Automation Flow" : "Email Automation Flow";

  return (
    <FlowColumn
      title={title}
      icon={icon}
      steps={campaign.steps}
      channel={channel}
      editingStepId={editingStepId}
      onEditStep={onEditStep}
      onUpdateStep={updateStep}
      onDeleteStep={deleteStep}
      onAddStep={addStep}
      onReorder={reorder}
    />
  );
}

// ─── Shared flow column ─────────────────────────────────────────────────────

interface FlowColumnProps {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly steps: readonly FlowStep[];
  readonly channel: "sms" | "email";
  readonly editingStepId: string | null;
  readonly onEditStep: (id: string | null) => void;
  readonly onUpdateStep: (id: string, field: keyof FlowStep, value: string) => void;
  readonly onDeleteStep: (id: string) => void;
  readonly onAddStep: () => void;
  readonly onReorder: (fromIndex: number, toIndex: number) => void;
}

function FlowColumn({
  title,
  icon,
  steps,
  channel,
  editingStepId,
  onEditStep,
  onUpdateStep,
  onDeleteStep,
  onAddStep,
  onReorder,
}: FlowColumnProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingDelayId, setEditingDelayId] = useState<string | null>(null);
  const delayInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDelayId) delayInputRef.current?.focus();
  }, [editingDelayId]);

  const handleDragStart = useCallback((index: number) => setDragIndex(index), []);

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
      if (dragIndex !== null && dragIndex !== dropIndex) {
        onReorder(dragIndex, dropIndex);
      }
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const moveStep = useCallback(
    (index: number, direction: "up" | "down") => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= steps.length) return;
      onReorder(index, target);
    },
    [steps.length, onReorder]
  );

  const dotBg = channel === "sms" ? "bg-green-400" : "bg-accent-blue";
  const dotRing = channel === "sms" ? "ring-green-400/20" : "ring-accent-blue/20";
  const lineBg = channel === "sms" ? "bg-green-400/20" : "bg-accent-blue/20";
  const delayBg =
    channel === "sms"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-accent-blue/10 text-accent-blue border-accent-blue/20";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <button
          onClick={onAddStep}
          className="flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors px-2 py-1 rounded-lg border border-brand-border hover:border-accent-blue/40"
        >
          <PlusIcon className="w-3 h-3" />
          Add
        </button>
      </div>

      <div className="relative">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
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
              className={`flex gap-3 transition-all ${isDragging ? "opacity-30 scale-95" : ""} ${
                isDragOver ? "translate-y-1" : ""
              }`}
            >
              {/* Reorder arrows + timeline */}
              <div className="flex items-start gap-1 shrink-0">
                {editingStepId !== step.id && (
                  <div className="flex flex-col items-center pt-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, "up"); }}
                      disabled={isFirst}
                      className={`p-0 leading-none transition-colors ${
                        isFirst ? "text-brand-muted/10 cursor-default" : "text-brand-muted/40 hover:text-white cursor-pointer"
                      }`}
                      title="Move up"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripIcon className="w-4 h-4 text-brand-muted/30 hover:text-brand-muted transition-colors" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, "down"); }}
                      disabled={isLast}
                      className={`p-0 leading-none transition-colors ${
                        isLast ? "text-brand-muted/10 cursor-default" : "text-brand-muted/40 hover:text-white cursor-pointer"
                      }`}
                      title="Move down"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${dotBg} ring-4 ${dotRing} shrink-0`} />
                  {!isLast && <div className={`w-0.5 flex-1 ${lineBg} min-h-[48px]`} />}
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
                    onUpdate={onUpdateStep}
                    onDone={() => onEditStep(null)}
                    onDelete={() => onDeleteStep(step.id)}
                    canDelete={steps.length > 1}
                    delayBg={delayBg}
                  />
                ) : (
                  <div
                    className="w-full text-left group rounded-lg p-2 -m-2 hover:bg-brand-border/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => onEditStep(step.id)}
                        className="text-sm text-white font-medium hover:text-accent-blue transition-colors"
                      >
                        {step.label}
                      </button>

                      {/* Inline-editable delay badge */}
                      {editingDelayId === step.id ? (
                        <input
                          ref={delayInputRef}
                          type="text"
                          value={step.delay}
                          onChange={(e) => onUpdateStep(step.id, "delay", e.target.value)}
                          onBlur={() => setEditingDelayId(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingDelayId(null)}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium bg-transparent outline-none w-20 text-center ${delayBg}`}
                          placeholder="Day ?"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setEditingDelayId(step.id); }}
                          className={`text-[10px] px-1.5 py-0 rounded-full border font-medium cursor-pointer hover:ring-1 hover:ring-offset-1 hover:ring-offset-transparent transition-all ${delayBg} ${
                            channel === "sms" ? "hover:ring-green-400/40" : "hover:ring-accent-blue/40"
                          }`}
                          title="Click to edit timing"
                        >
                          {step.delay}
                        </button>
                      )}

                      <PencilIcon className="w-3 h-3 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditStep(step.id)}
                      className="text-left"
                    >
                      <p className="text-xs text-brand-muted leading-relaxed">{step.description}</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {steps.length === 0 && (
        <div className="text-center py-8 border border-dashed border-brand-border rounded-lg">
          <p className="text-brand-muted text-xs mb-2">No steps yet</p>
          <button
            onClick={onAddStep}
            className="text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
          >
            + Add first step
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step edit form ─────────────────────────────────────────────────────────

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
          <button type="button" onClick={onDelete} className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors">
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
