"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Lead, LeadStatus } from "@/lib/marketing/types";
import { LEAD_STATUS_CONFIG } from "@/lib/marketing/types";
import { PlusIcon, PencilIcon } from "./icons";

interface LeadKanbanProps {
  readonly leads: readonly Lead[];
  readonly onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  readonly onEditLead: (lead: Lead) => void;
  readonly columns: readonly KanbanColumn[];
  readonly onUpdateColumns: (columns: readonly KanbanColumn[]) => void;
}

export interface KanbanColumn {
  readonly id: string;
  readonly status: LeadStatus;
  readonly label: string;
  readonly color: string;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", dot: "bg-orange-400" },
  green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", dot: "bg-green-400" },
  red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", dot: "bg-red-400" },
  gray: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400", dot: "bg-gray-400" },
};

export function getDefaultColumns(): readonly KanbanColumn[] {
  return LEAD_STATUS_CONFIG.map((s) => ({
    id: crypto.randomUUID(),
    status: s.value,
    label: s.label,
    color: s.color,
  }));
}

export function LeadKanban({
  leads,
  onUpdateStatus,
  onEditLead,
  columns,
  onUpdateColumns,
}: LeadKanbanProps) {
  const [dragLeadId, setDragLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColLabel, setNewColLabel] = useState("");
  const newColRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingColumn) newColRef.current?.focus();
  }, [addingColumn]);

  // ─── Drag lead between columns ──────────────────────────
  const handleLeadDragStart = useCallback((leadId: string) => {
    setDragLeadId(leadId);
  }, []);

  const handleColDragOver = useCallback(
    (e: React.DragEvent, colStatus: LeadStatus) => {
      e.preventDefault();
      if (dragLeadId) setDragOverCol(colStatus);
    },
    [dragLeadId]
  );

  const handleColDrop = useCallback(
    (colStatus: LeadStatus) => {
      if (dragLeadId) {
        onUpdateStatus(dragLeadId, colStatus);
      }
      setDragLeadId(null);
      setDragOverCol(null);
    },
    [dragLeadId, onUpdateStatus]
  );

  const handleDragEnd = useCallback(() => {
    setDragLeadId(null);
    setDragOverCol(null);
  }, []);

  // ─── Column management ──────────────────────────────────
  const addColumn = useCallback(() => {
    if (!newColLabel.trim()) return;
    const statusId = newColLabel.trim().toLowerCase().replace(/\s+/g, "_") as LeadStatus;
    const newCol: KanbanColumn = {
      id: crypto.randomUUID(),
      status: statusId,
      label: newColLabel.trim(),
      color: "blue",
    };
    onUpdateColumns([...columns, newCol]);
    setNewColLabel("");
    setAddingColumn(false);
  }, [newColLabel, columns, onUpdateColumns]);

  const deleteColumn = useCallback(
    (colId: string) => {
      if (columns.length <= 2) return;
      onUpdateColumns(columns.filter((c) => c.id !== colId));
    },
    [columns, onUpdateColumns]
  );

  const updateColumnLabel = useCallback(
    (colId: string, label: string) => {
      onUpdateColumns(
        columns.map((c) => (c.id === colId ? { ...c, label } : c))
      );
    },
    [columns, onUpdateColumns]
  );

  const cycleColumnColor = useCallback(
    (colId: string) => {
      const colorKeys = Object.keys(STATUS_COLORS);
      const col = columns.find((c) => c.id === colId);
      if (!col) return;
      const idx = colorKeys.indexOf(col.color);
      const nextColor = colorKeys[(idx + 1) % colorKeys.length];
      onUpdateColumns(
        columns.map((c) => (c.id === colId ? { ...c, color: nextColor } : c))
      );
    },
    [columns, onUpdateColumns]
  );

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border bg-brand-border/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <span className="text-sm text-white font-medium">Pipeline</span>
          <span className="text-xs text-brand-muted">{leads.length} leads</span>
        </div>
        <button
          type="button"
          onClick={() => setAddingColumn(true)}
          className="flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Stage
        </button>
      </div>

      {/* Kanban columns */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3 min-w-0" style={{ minWidth: `${columns.length * 220}px` }}>
          {columns.map((col) => {
            const colLeads = leads.filter((l) => l.status === col.status);
            const colors = STATUS_COLORS[col.color] ?? STATUS_COLORS.blue;
            const isDragOver = dragOverCol === col.status;

            return (
              <div
                key={col.id}
                className={`flex-1 min-w-[200px] max-w-[280px] rounded-xl border transition-colors ${
                  isDragOver
                    ? `${colors.border} ${colors.bg}`
                    : "border-brand-border/50 bg-brand-border/5"
                }`}
                onDragOver={(e) => handleColDragOver(e, col.status)}
                onDrop={() => handleColDrop(col.status)}
              >
                {/* Column header */}
                <div className="px-3 py-2.5 border-b border-brand-border/30 flex items-center justify-between group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => cycleColumnColor(col.id)}
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot} hover:ring-2 hover:ring-offset-1 hover:ring-offset-transparent hover:ring-current transition-all cursor-pointer`}
                      title="Click to change color"
                    />
                    {editingColumnId === col.id ? (
                      <ColumnLabelEditor
                        value={col.label}
                        onChange={(v) => updateColumnLabel(col.id, v)}
                        onDone={() => setEditingColumnId(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingColumnId(col.id)}
                        className={`text-xs font-semibold truncate ${colors.text} hover:opacity-80 transition-opacity`}
                      >
                        {col.label}
                      </button>
                    )}
                    <span className="text-[10px] text-brand-muted/60 shrink-0">
                      {colLeads.length}
                    </span>
                  </div>
                  {columns.length > 2 && (
                    <button
                      type="button"
                      onClick={() => deleteColumn(col.id)}
                      className="opacity-0 group-hover:opacity-100 text-brand-muted/40 hover:text-red-400 transition-all p-0.5"
                      title="Remove stage"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Lead cards */}
                <div className="p-2 space-y-2 min-h-[80px]">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onDragStart={() => handleLeadDragStart(lead.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={dragLeadId === lead.id}
                      onEdit={() => onEditLead(lead)}
                    />
                  ))}
                  {colLeads.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-[10px] text-brand-muted/40">Drop leads here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add column inline */}
          {addingColumn && (
            <div className="min-w-[200px] max-w-[280px] rounded-xl border border-dashed border-accent-blue/30 bg-accent-blue/5 p-3">
              <input
                ref={newColRef}
                type="text"
                value={newColLabel}
                onChange={(e) => setNewColLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addColumn();
                  if (e.key === "Escape") { setAddingColumn(false); setNewColLabel(""); }
                }}
                placeholder="Stage name..."
                className="w-full text-xs text-white bg-transparent border-b border-accent-blue/30 outline-none py-1 placeholder:text-brand-muted/40"
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setAddingColumn(false); setNewColLabel(""); }}
                  className="text-[10px] text-brand-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addColumn}
                  className="text-[10px] font-medium text-accent-blue hover:text-accent-purple transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lead card ────────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onDragStart,
  onDragEnd,
  isDragging,
  onEdit,
}: {
  readonly lead: Lead;
  readonly onDragStart: () => void;
  readonly onDragEnd: () => void;
  readonly isDragging: boolean;
  readonly onEdit: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`rounded-lg border border-brand-border/40 bg-[#0f1117] px-3 py-2 cursor-grab active:cursor-grabbing group transition-all hover:border-brand-muted/30 ${
        isDragging ? "opacity-30 scale-95" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">{lead.name}</p>
          {lead.company && (
            <p className="text-[10px] text-brand-muted truncate mt-0.5">{lead.company}</p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="opacity-0 group-hover:opacity-100 text-brand-muted/40 hover:text-accent-blue transition-all p-0.5 shrink-0"
          title="Edit lead"
        >
          <PencilIcon className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        {lead.phone && (
          <span className="text-[10px] text-brand-muted truncate">{lead.phone}</span>
        )}
        {lead.phone && lead.email && (
          <span className="text-[10px] text-brand-muted/30">·</span>
        )}
        {lead.email && (
          <span className="text-[10px] text-brand-muted truncate">{lead.email}</span>
        )}
      </div>
      {lead.notes && (
        <p className="text-[10px] text-brand-muted/60 mt-1 line-clamp-2 leading-relaxed">
          {lead.notes}
        </p>
      )}
    </div>
  );
}

// ─── Column label inline editor ───────────────────────────────────────────────

function ColumnLabelEditor({
  value,
  onChange,
  onDone,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly onDone: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onDone}
      onKeyDown={(e) => e.key === "Enter" && onDone()}
      className="text-xs font-semibold text-white bg-transparent border-b border-accent-blue/40 outline-none py-0 w-full min-w-0"
    />
  );
}
