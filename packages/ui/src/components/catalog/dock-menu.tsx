"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface DockMenuProps {
  items: DockItem[];
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * DockMenu - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DockMenu.tsx
 * @catalog-status candidate
 */
export function DockMenu({ items, onSelect, className }: DockMenuProps) {
  return (
    <div className={cn("flex items-center gap-1 px-3 py-2 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-lg", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item.id)}
          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-all hover:scale-110 text-muted-foreground hover:text-foreground"
          title={item.label}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
