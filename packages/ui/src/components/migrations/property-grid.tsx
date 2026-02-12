"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PropertyGridItem {
  key: string;
  value: string | number | boolean;
  category?: string;
  editable?: boolean;
}

export interface PropertyGridProps {
  items?: PropertyGridItem[];
  title?: string;
  className?: string;
}

/**
 * PropertyGrid - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/PropertyGrid.tsx
 * @migration-status candidate
 */
export function PropertyGrid({ items = [], title, className }: PropertyGridProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="px-4 py-2 border-b border-cyan-500/10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="divide-y divide-cyan-500/5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3 px-4 py-1.5">
            <span className="text-xs font-mono text-cyan-500/60 w-32 truncate">{item.key}</span>
            <span className="text-xs font-mono text-cyan-300/80 flex-1">{String(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
