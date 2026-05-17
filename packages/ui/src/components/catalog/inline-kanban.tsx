"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface KanbanCard {
  id: string;
  title: string;
  column: string;
  priority?: "P0" | "P1" | "P2" | "P3";
  type?: string;
  blockedBy?: string[];
  blocks?: string[];
  description?: string;
  owner?: string;
}

export interface InlineKanbanProps {
  columns?: string[];
  cards?: KanbanCard[];
  onMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  className?: string;
}

const DEFAULT_COLS = ["open", "in_progress", "blocked", "closed"];

const P_STYLES: Record<string, string> = {
  P0: "bg-red-500/20 text-red-400 border-red-500/40",
  P1: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  P2: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  P3: "bg-gray-700/30 text-gray-400 border-gray-600/40",
};

const colLabel = (c: string) =>
  c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/**
 * InlineKanban - Lightweight drag-and-drop kanban board
 * Extracted from CanvasRenderer for standalone use
 */
export function InlineKanban({
  columns = DEFAULT_COLS,
  cards = [],
  onMove,
  className,
}: InlineKanbanProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const byCol = (col: string) => cards.filter((c) => c.column === col);

  const drop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const card = cards.find((c) => c.id === id);
    if (!card || card.column === toColumn) {
      setDragId(null);
      return;
    }
    onMove?.(id, card.column, toColumn);
    setDragId(null);
  };

  return (
    <div className={cn("flex gap-3 overflow-x-auto pb-2", className)}>
      {columns.map((col) => (
        <div
          key={col}
          className="bg-black/40 rounded-xl p-3 min-h-[200px] flex-1 min-w-[220px] flex flex-col gap-2"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={(e) => drop(e, col)}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400">
              {colLabel(col)}
            </h3>
            <span className="bg-gray-800 text-gray-400 text-xs font-mono rounded-full px-2 py-0.5">
              {byCol(col).length}
            </span>
          </div>
          {byCol(col).map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", card.id);
                setDragId(card.id);
              }}
              onDragEnd={() => setDragId(null)}
              onClick={() =>
                setExpandedId(expandedId === card.id ? null : card.id)
              }
              className={cn(
                "bg-black/60 border border-cyan-500/10 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-cyan-500/30 transition-colors",
                dragId === card.id && "opacity-40"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-mono text-sm text-cyan-400 shrink-0">
                  {card.id}
                </span>
                {card.priority && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded border",
                      P_STYLES[card.priority] ?? P_STYLES.P3
                    )}
                  >
                    {card.priority}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-snug">{card.title}</p>
              {card.blockedBy && card.blockedBy.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-red-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {card.blockedBy.length} blocker
                  {card.blockedBy.length > 1 ? "s" : ""}
                </div>
              )}
              {card.owner && (
                <p className="mt-1 text-[10px] text-gray-500 font-mono truncate">
                  {card.owner}
                </p>
              )}
              {expandedId === card.id && card.description && (
                <p className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>
          ))}
          {byCol(col).length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-gray-600 font-mono">Empty</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
