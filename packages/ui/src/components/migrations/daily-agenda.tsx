"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  type?: "meeting" | "task" | "reminder" | "event";
}

export interface DailyAgendaProps {
  date: string;
  items: AgendaItem[];
  className?: string;
}

/**
 * DailyAgenda - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DailyAgenda.tsx
 * @migration-status candidate
 */
export function DailyAgenda({ date, items, className }: DailyAgendaProps) {
  const typeColor: Record<string, string> = {
    meeting: "bg-blue-500", task: "bg-emerald-500", reminder: "bg-amber-500", event: "bg-purple-500",
  };

  return (
    <div className={cn("border border-border rounded-md bg-card", className)}>
      <div className="px-4 py-2 border-b border-border text-sm font-medium text-foreground">{date}</div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", typeColor[item.type ?? "task"])} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
              </div>
              {item.description && <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
