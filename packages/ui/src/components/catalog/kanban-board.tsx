"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  className?: string;
}

/**
 * KanbanBoard - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/KanbanBoard.tsx
 * @catalog-status candidate
 */
export function KanbanBoard({ columns = [], className }: KanbanBoardProps) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {columns.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
          <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            {col.title}
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{col.items.length}</span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {col.items.map((item) => (
              <div key={item.id} className="p-3 rounded-md border border-border bg-card hover:bg-muted/50 transition-colors">
                <div className="text-sm text-foreground">{item.title}</div>
                {item.description && <div className="text-xs text-muted-foreground mt-1">{item.description}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
