"use client";

import * as React from "react";
import { useState, type DragEvent } from "react";
import { cn } from "../../lib/utils";

/* ── Types ── */

interface SofiaWidgetProps {
  provider: "sofia";
  widgetId: string;
  variant?: string;
  data?: Record<string, unknown>;
}

type CanvasInteractionPayload =
  | {
      type: "canvas_interaction";
      action: "render";
      componentType: "sofia-widget";
      componentName?: string;
      props: SofiaWidgetProps;
      instruction?: string;
    }
  | {
      type: "canvas_interaction";
      action: "selection";
      instruction?: string;
      selectionType?: string;
    };

export interface CanvasRendererProps {
  payload: CanvasInteractionPayload;
  onRespond: (data: Record<string, unknown>) => void;
  className?: string;
}

/* ── Helpers ── */

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const asString = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
const asStringArray = (v: unknown): string[] | undefined =>
  Array.isArray(v) ? v.filter((i): i is string => typeof i === "string") : undefined;

interface KanbanCard {
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

interface TodoItem {
  id: string;
  text: string;
  checked?: boolean;
  priority?: string;
}

const asKanbanCards = (value: unknown): KanbanCard[] => {
  if (!Array.isArray(value)) return [];
  const cards: KanbanCard[] = [];
  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id), title = asString(item.title), column = asString(item.column);
    if (!id || !title || !column) continue;
    const card: KanbanCard = { id, title, column };
    const p = asString(item.priority);
    if (p === "P0" || p === "P1" || p === "P2" || p === "P3") card.priority = p;
    const t = asString(item.type); if (t) card.type = t;
    const bb = asStringArray(item.blockedBy); if (bb) card.blockedBy = bb;
    const bl = asStringArray(item.blocks); if (bl) card.blocks = bl;
    const d = asString(item.description); if (d) card.description = d;
    const o = asString(item.owner); if (o) card.owner = o;
    cards.push(card);
  }
  return cards;
};

const asTodoItems = (value: unknown): TodoItem[] => {
  if (!Array.isArray(value)) return [];
  const items: TodoItem[] = [];
  for (const entry of value) {
    const item = asRecord(entry);
    const id = asString(item.id), text = asString(item.text);
    if (!id || !text) continue;
    const todo: TodoItem = { id, text };
    if (typeof item.checked === "boolean") todo.checked = item.checked;
    const pr = asString(item.priority); if (pr) todo.priority = pr;
    items.push(todo);
  }
  return items;
};

const resolveWidgetKind = (widget: SofiaWidgetProps): string =>
  widget.variant?.toLowerCase() ?? widget.widgetId.toLowerCase();

/**
 * CanvasRenderer - Catalog component from canvas package
 * @source packages/canvas/src/components/CanvasRenderer.tsx
 * @catalog-status candidate
 * @needs-review true - consolidates KanbanBoard, TodoList, MarkdownCard inline
 */
export function CanvasRenderer({ payload, onRespond, className }: CanvasRendererProps) {
  if (payload.action === "selection") {
    return (
      <div className={cn("rounded-xl border border-gray-800 backdrop-blur-md p-4 space-y-3", className)}>
        <p className="font-mono text-sm text-[var(--warning)]">Canvas selection requested.</p>
        <p className="text-sm text-gray-300">{payload.instruction ?? "Select an object on the canvas."}</p>
        <button
          type="button"
          className="rounded-md border border-[var(--primary)]/40 px-3 py-1.5 text-xs font-mono text-[var(--primary)] hover:bg-[var(--primary)]/10"
          onClick={() => onRespond({ action: "selection_acknowledged", selectionType: payload.selectionType ?? "object" })}
        >
          Acknowledge
        </button>
      </div>
    );
  }

  const { componentType, props } = payload;
  if (componentType !== "sofia-widget" || props.provider !== "sofia") {
    return (
      <div className={cn("rounded-xl border border-gray-800 backdrop-blur-md p-4", className)}>
        <p className="font-mono text-sm text-[var(--warning)] mb-2">Invalid Sofia payload contract.</p>
        <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    );
  }

  const kind = resolveWidgetKind(props);
  const data = asRecord(props.data);

  if (kind === "kanban" || kind === "bd-dashboard") {
    return (
      <InlineKanban columns={asStringArray(data.columns)} cards={asKanbanCards(data.cards)} onRespond={onRespond} />
    );
  }
  if (kind === "todo" || kind === "todo-list" || kind === "todolist") {
    return (
      <InlineTodo title={asString(data.title)} items={asTodoItems(data.items)} onRespond={onRespond} />
    );
  }
  if (kind === "markdown" || kind === "markdown-card") {
    return <InlineMarkdown title={asString(data.title)} content={asString(data.content)} />;
  }

  return (
    <div className={cn("rounded-xl border border-gray-800 backdrop-blur-md p-4", className)}>
      <p className="font-mono text-sm text-[var(--accent)] mb-2">Sofia widget: {props.widgetId}</p>
      <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap break-all">
        {JSON.stringify(props.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}

/* ── Inline Kanban ── */

const KANBAN_COLS = ["open", "in_progress", "blocked", "closed"];
const P_STYLES: Record<string, string> = {
  P0: "bg-[var(--danger)]/20 text-[var(--danger)] border-[var(--danger)]/40",
  P1: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/40",
  P2: "bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/40",
  P3: "bg-gray-700/30 text-gray-400 border-gray-600/40",
};
const colLabel = (c: string) => c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

function InlineKanban({ columns = KANBAN_COLS, cards = [], onRespond }: { columns?: string[]; cards?: KanbanCard[]; onRespond: (d: Record<string, unknown>) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const byCol = (col: string) => cards.filter((c) => c.column === col);

  const drop = (e: DragEvent, toColumn: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const card = cards.find((c) => c.id === id);
    if (!card || card.column === toColumn) { setDragId(null); return; }
    onRespond({ action: "move", cardId: id, fromColumn: card.column, toColumn });
    setDragId(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => (
        <div key={col} className="bg-[var(--bg-secondary)] rounded-xl p-3 min-h-[200px] flex-1 min-w-[220px] flex flex-col gap-2"
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
          onDrop={(e) => drop(e, col)}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400">{colLabel(col)}</h3>
            <span className="bg-gray-800 text-gray-400 text-xs font-mono rounded-full px-2 py-0.5">{byCol(col).length}</span>
          </div>
          {byCol(col).map((card) => (
            <div key={card.id} draggable
              onDragStart={(e) => { e.dataTransfer.setData("text/plain", card.id); setDragId(card.id); }}
              onDragEnd={() => setDragId(null)}
              onClick={() => setExpandedId(expandedId === card.id ? null : card.id)}
              className={cn("bg-[var(--bg-tertiary,#111)] border border-[var(--glass-border,#222)] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[var(--primary)]/30 transition-colors", dragId === card.id && "opacity-40")}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-mono text-sm text-cyan-400 shrink-0">{card.id}</span>
                {card.priority && <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded border", P_STYLES[card.priority] ?? P_STYLES.P3)}>{card.priority}</span>}
              </div>
              <p className="text-sm text-gray-200 leading-snug">{card.title}</p>
              {card.blockedBy && card.blockedBy.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[var(--danger)] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
                  {card.blockedBy.length} blocker{card.blockedBy.length > 1 ? "s" : ""}
                </div>
              )}
              {card.owner && <p className="mt-1 text-[10px] text-gray-500 font-mono truncate">{card.owner}</p>}
              {expandedId === card.id && card.description && (
                <p className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 leading-relaxed">{card.description}</p>
              )}
            </div>
          ))}
          {byCol(col).length === 0 && <div className="flex-1 flex items-center justify-center"><p className="text-xs text-gray-600 font-mono">Empty</p></div>}
        </div>
      ))}
    </div>
  );
}

/* ── Inline Todo ── */

function InlineTodo({ title, items = [], onRespond }: { title?: string; items?: TodoItem[]; onRespond: (d: Record<string, unknown>) => void }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4">
      {title && <h2 className="font-mono text-sm text-cyan-400 mb-3">{title}</h2>}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 group">
            <button onClick={() => onRespond({ action: "toggle", itemId: item.id, checked: !item.checked })}
              className={cn("mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors", item.checked ? "bg-cyan-500 border-cyan-500" : "border-gray-600 hover:border-cyan-500/50")}>
              {item.checked && <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
            <span className={cn("text-sm leading-snug", item.checked ? "line-through text-gray-600" : "text-gray-200")}>{item.text}</span>
            {item.priority && <span className="ml-auto text-[10px] font-mono text-gray-500 shrink-0">{item.priority}</span>}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-xs text-gray-600 font-mono text-center py-4">No items</p>}
    </div>
  );
}

/* ── Inline Markdown ── */

function InlineMarkdown({ title, content }: { title?: string; content?: string }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4">
      {title && <h2 className="font-mono text-sm text-cyan-400 mb-3">{title}</h2>}
      {content ? (
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gray-200 prose-headings:font-mono prose-code:text-cyan-400 prose-p:text-gray-300">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-600 font-mono">No content</p>
      )}
    </div>
  );
}
