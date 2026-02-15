"use client";

import { useState, useCallback } from "react";
import type { Pipeline } from "./LeadKanban";
import type { Campaign } from "./types";
import type { AutomationRule, AutomationTrigger, AutomationActionType } from "./automationTypes";
import { TRIGGER_LABELS, ACTION_LABELS, createAutomationRule, createAutomationAction } from "./automationTypes";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import { BoltIcon, PlusIcon } from "./icons";

interface PipelineAutomationProps {
  readonly pipelines: readonly Pipeline[];
  readonly campaigns: readonly Campaign[];
  readonly rules: readonly AutomationRule[];
  readonly onUpdateRules: (rules: readonly AutomationRule[]) => void;
}

export function PipelineAutomation({
  pipelines,
  campaigns,
  rules,
  onUpdateRules,
}: PipelineAutomationProps) {
  const [activeRuleId, setActiveRuleId] = useState<string | null>(rules[0]?.id ?? null);
  const activeRule = rules.find((r) => r.id === activeRuleId) ?? null;

  const addRule = useCallback(() => {
    const rule = createAutomationRule(
      "New Automation",
      pipelines[0]?.id ?? "",
      "enters_stage"
    );
    onUpdateRules([...rules, rule]);
    setActiveRuleId(rule.id);
  }, [pipelines, rules, onUpdateRules]);

  const deleteRule = useCallback(
    (ruleId: string) => {
      const filtered = rules.filter((r) => r.id !== ruleId);
      onUpdateRules(filtered);
      if (activeRuleId === ruleId) {
        setActiveRuleId(filtered[0]?.id ?? null);
      }
    },
    [rules, activeRuleId, onUpdateRules]
  );

  const updateRule = useCallback(
    (updated: AutomationRule) => {
      onUpdateRules(rules.map((r) => (r.id === updated.id ? updated : r)));
    },
    [rules, onUpdateRules]
  );

  const toggleActive = useCallback(
    (ruleId: string) => {
      onUpdateRules(
        rules.map((r) =>
          r.id === ruleId ? { ...r, isActive: !r.isActive } : r
        )
      );
    },
    [rules, onUpdateRules]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Sidebar — rule list */}
        <div className="border border-brand-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">Rules</span>
              <span className="text-xs text-brand-muted">{rules.length}</span>
            </div>
            <button
              type="button"
              onClick={addRule}
              className="flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              New
            </button>
          </div>

          <div className="divide-y divide-brand-border/50">
            {rules.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BoltIcon className="w-6 h-6 text-brand-muted/40 mx-auto mb-2" />
                <p className="text-xs text-brand-muted/60">No automation rules yet</p>
                <button
                  type="button"
                  onClick={addRule}
                  className="mt-2 text-xs text-accent-blue hover:text-accent-purple transition-colors"
                >
                  Create your first rule
                </button>
              </div>
            ) : (
              rules.map((rule) => {
                const isActive = rule.id === activeRuleId;
                const pipeline = pipelines.find((p) => p.id === rule.pipelineId);
                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => setActiveRuleId(rule.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${
                      isActive
                        ? "bg-accent-blue/5 border-l-2 border-l-accent-blue"
                        : "hover:bg-brand-border/10 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <BoltIcon className={`w-3 h-3 shrink-0 ${rule.isActive ? "text-yellow-400" : "text-brand-muted/50"}`} />
                        <span className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-brand-muted"}`}>
                          {rule.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-5">
                        <span className="text-[10px] text-brand-muted/80 truncate">
                          {pipeline?.name ?? "No pipeline"}
                        </span>
                        <span className="text-[10px] text-brand-muted/60">·</span>
                        <span className="text-[10px] text-brand-muted/80">
                          {rule.actions.length} action{rule.actions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteRule(rule.id); }}
                      className="opacity-0 group-hover:opacity-100 text-brand-muted hover:text-red-400 transition-all p-1"
                      title="Delete rule"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Editor — rule config */}
        {activeRule ? (
          <AutomationEditor
            rule={activeRule}
            pipelines={pipelines}
            campaigns={campaigns}
            onUpdate={updateRule}
            onToggleActive={() => toggleActive(activeRule.id)}
          />
        ) : (
          <div className="border border-brand-border rounded-xl flex items-center justify-center py-20">
            <p className="text-brand-muted text-sm">
              Select or create an automation rule to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Automation Editor ───────────────────────────────────────────────────────

function AutomationEditor({
  rule,
  pipelines,
  campaigns,
  onUpdate,
  onToggleActive,
}: {
  readonly rule: AutomationRule;
  readonly pipelines: readonly Pipeline[];
  readonly campaigns: readonly Campaign[];
  readonly onUpdate: (rule: AutomationRule) => void;
  readonly onToggleActive: () => void;
}) {
  const activePipeline = pipelines.find((p) => p.id === rule.pipelineId);

  const updateName = useCallback(
    (name: string) => onUpdate({ ...rule, name }),
    [rule, onUpdate]
  );

  const updatePipeline = useCallback(
    (pipelineId: string) => onUpdate({ ...rule, pipelineId, triggerStage: undefined }),
    [rule, onUpdate]
  );

  const updateTrigger = useCallback(
    (trigger: AutomationTrigger) => onUpdate({ ...rule, trigger }),
    [rule, onUpdate]
  );

  const updateTriggerStage = useCallback(
    (triggerStage: string) => onUpdate({ ...rule, triggerStage }),
    [rule, onUpdate]
  );

  const addAction = useCallback(
    (type: AutomationActionType) => {
      const action = createAutomationAction(type);
      onUpdate({ ...rule, actions: [...rule.actions, action] });
    },
    [rule, onUpdate]
  );

  const removeAction = useCallback(
    (actionId: string) => {
      onUpdate({ ...rule, actions: rule.actions.filter((a) => a.id !== actionId) });
    },
    [rule, onUpdate]
  );

  const updateAction = useCallback(
    (actionId: string, fields: Partial<Omit<AutomationRule["actions"][number], "id">>) => {
      onUpdate({
        ...rule,
        actions: rule.actions.map((a) =>
          a.id === actionId ? { ...a, ...fields } : a
        ),
      });
    },
    [rule, onUpdate]
  );

  const triggerNeedsStage = rule.trigger === "enters_stage" || rule.trigger === "leaves_stage";

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <input
          type="text"
          value={rule.name}
          onChange={(e) => updateName(e.target.value)}
          className="text-sm text-white font-medium bg-transparent outline-none border-b border-transparent hover:border-brand-muted/30 focus:border-accent-blue transition-colors flex-1 mr-3"
        />
        <button
          type="button"
          onClick={onToggleActive}
          className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
            rule.isActive
              ? "bg-green-500/15 text-green-400 border-green-500/30"
              : "bg-brand-border/20 text-brand-muted border-brand-border"
          }`}
        >
          {rule.isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Pipeline selector */}
        <div>
          <label className="text-[10px] text-brand-muted/70 uppercase tracking-wider block mb-1.5">
            Pipeline
          </label>
          <select
            value={rule.pipelineId}
            onChange={(e) => updatePipeline(e.target.value)}
            className="w-full text-xs text-white bg-[#0f1117] border border-brand-border rounded-lg px-3 py-2 outline-none focus:border-accent-blue transition-colors"
          >
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Trigger selector */}
        <div>
          <label className="text-[10px] text-brand-muted/70 uppercase tracking-wider block mb-1.5">
            When
          </label>
          <select
            value={rule.trigger}
            onChange={(e) => updateTrigger(e.target.value as AutomationTrigger)}
            className="w-full text-xs text-white bg-[#0f1117] border border-brand-border rounded-lg px-3 py-2 outline-none focus:border-accent-blue transition-colors"
          >
            {(Object.keys(TRIGGER_LABELS) as AutomationTrigger[]).map((t) => (
              <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Stage selector (conditional) */}
        {triggerNeedsStage && activePipeline && (
          <div>
            <label className="text-[10px] text-brand-muted/70 uppercase tracking-wider block mb-1.5">
              Stage
            </label>
            <select
              value={rule.triggerStage ?? ""}
              onChange={(e) => updateTriggerStage(e.target.value)}
              className="w-full text-xs text-white bg-[#0f1117] border border-brand-border rounded-lg px-3 py-2 outline-none focus:border-accent-blue transition-colors"
            >
              <option value="">Select a stage...</option>
              {activePipeline.columns.map((col) => (
                <option key={col.id} value={col.status}>{col.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] text-brand-muted/70 uppercase tracking-wider">
              Then do
            </label>
          </div>

          {rule.actions.length === 0 ? (
            <div className="border border-dashed border-brand-border/40 rounded-lg px-4 py-6 text-center">
              <p className="text-xs text-brand-muted/60 mb-2">No actions configured</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rule.actions.map((action, idx) => (
                <div
                  key={action.id}
                  className="flex items-start gap-3 border border-brand-border/40 rounded-lg px-3 py-2.5 bg-brand-border/5"
                >
                  <span className="text-[10px] text-brand-muted/60 mt-1 shrink-0 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span className="text-xs text-white font-medium">
                      {ACTION_LABELS[action.type]}
                    </span>
                    {action.type === "send_campaign" && (
                      <select
                        value={action.campaignId ?? ""}
                        onChange={(e) => updateAction(action.id, { campaignId: e.target.value })}
                        className="w-full text-[11px] text-brand-muted bg-[#0f1117] border border-brand-border/50 rounded px-2 py-1 outline-none focus:border-accent-blue"
                      >
                        <option value="">Select campaign...</option>
                        {campaigns.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                    {action.type === "change_status" && (
                      <select
                        value={action.status ?? ""}
                        onChange={(e) => updateAction(action.id, { status: e.target.value as AutomationRule["actions"][number]["status"] })}
                        className="w-full text-[11px] text-brand-muted bg-[#0f1117] border border-brand-border/50 rounded px-2 py-1 outline-none focus:border-accent-blue"
                      >
                        <option value="">Select status...</option>
                        {LEAD_STATUS_CONFIG.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    )}
                    {action.type === "send_notification" && (
                      <input
                        type="text"
                        value={action.message ?? ""}
                        onChange={(e) => updateAction(action.id, { message: e.target.value })}
                        placeholder="Notification message..."
                        className="w-full text-[11px] text-brand-muted bg-[#0f1117] border border-brand-border/50 rounded px-2 py-1 outline-none focus:border-accent-blue placeholder:text-brand-muted/50"
                      />
                    )}
                    {action.type === "wait" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={action.days ?? 1}
                          onChange={(e) => updateAction(action.id, { days: parseInt(e.target.value) || 1 })}
                          className="w-16 text-[11px] text-brand-muted bg-[#0f1117] border border-brand-border/50 rounded px-2 py-1 outline-none focus:border-accent-blue"
                        />
                        <span className="text-[11px] text-brand-muted/80">days</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAction(action.id)}
                    className="text-brand-muted/50 hover:text-red-400 transition-colors p-0.5 mt-0.5 shrink-0"
                    title="Remove action"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add action buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {(Object.keys(ACTION_LABELS) as AutomationActionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addAction(type)}
                className="text-[10px] text-brand-muted/80 hover:text-accent-blue border border-brand-border/30 hover:border-accent-blue/30 px-2 py-1 rounded-lg transition-colors"
              >
                + {ACTION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
