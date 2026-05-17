"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RecurringEventEditorProps {
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  interval?: number;
  onFrequencyChange?: (freq: string) => void;
  onIntervalChange?: (interval: number) => void;
  className?: string;
}

/**
 * RecurringEventEditor - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/RecurringEventEditor.tsx
 * @catalog-status candidate
 */
export function RecurringEventEditor({ frequency = "weekly", interval = 1, onFrequencyChange, onIntervalChange, className }: RecurringEventEditorProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-3", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">RECURRENCE</div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-cyan-500/60">Every</span>
        <input
          type="number"
          min={1}
          value={interval}
          onChange={(e) => onIntervalChange?.(Number(e.target.value))}
          className="w-14 bg-black/40 border border-cyan-500/20 rounded px-2 py-1 text-xs font-mono text-cyan-300 text-center"
        />
        <div className="flex gap-1">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((f) => (
            <button
              key={f}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-mono uppercase border transition-colors",
                f === frequency ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" : "border-cyan-500/10 text-cyan-500/40 hover:border-cyan-500/20"
              )}
              onClick={() => onFrequencyChange?.(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
