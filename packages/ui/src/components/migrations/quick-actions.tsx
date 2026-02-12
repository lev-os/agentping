"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  onClick?: () => void;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

/**
 * QuickActions - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/QuickActions.tsx
 * @migration-status candidate
 */
export function QuickActions({ actions = [], className }: QuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((a) => (
        <button
          key={a.id}
          onClick={a.onClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500/20 bg-black/40 text-xs font-mono text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-colors"
        >
          {a.icon && <span>{a.icon}</span>}
          <span>{a.label}</span>
          {a.shortcut && <span className="text-cyan-500/30 ml-1">{a.shortcut}</span>}
        </button>
      ))}
    </div>
  );
}
