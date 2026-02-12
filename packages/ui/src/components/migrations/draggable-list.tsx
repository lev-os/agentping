"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DraggableItem {
  id: string;
  content: React.ReactNode;
}

export interface DraggableListProps {
  items: DraggableItem[];
  onReorder?: (items: DraggableItem[]) => void;
  className?: string;
}

/**
 * DraggableList - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DraggableList.tsx
 * @migration-status candidate
 * @needs-review Simplified — original uses HTML drag-and-drop API
 */
export function DraggableList({ items: initialItems, onReorder, className }: DraggableListProps) {
  const [items, setItems] = React.useState(initialItems);

  const moveItem = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    onReorder?.(next);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} role="listbox" aria-label="Reorderable list">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border" role="option" aria-selected={false}>
          <div className="flex flex-col gap-0.5 shrink-0">
            <button disabled={i === 0} onClick={() => moveItem(i, i - 1)} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">&uarr;</button>
            <button disabled={i === items.length - 1} onClick={() => moveItem(i, i + 1)} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">&darr;</button>
          </div>
          <div className="flex-1">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
