"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ResourceEntry {
  label: string;
  current: number;
  max: number;
  unit: string;
}

export interface ResourceViewProps {
  resources: ResourceEntry[];
  className?: string;
}

function getBarColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-yellow-500";
  return "bg-cyan-500";
}

function getTextColor(pct: number): string {
  if (pct >= 90) return "text-red-400";
  if (pct >= 70) return "text-yellow-400";
  return "text-cyan-400";
}

/**
 * ResourceView - Detailed resource monitor with bars
 * @source packages/adapters/web-ui/src/components/ResourceView.tsx
 * @catalog-status implemented
 */
export function ResourceView({ resources, className }: ResourceViewProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">
        Resource Monitor
      </div>

      <div className="space-y-4">
        {resources.map((res, i) => {
          const pct = res.max > 0 ? Math.min((res.current / res.max) * 100, 100) : 0;
          const barColor = getBarColor(pct);
          const textColor = getTextColor(pct);

          return (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-mono text-gray-300">{res.label}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("text-sm font-mono font-bold tabular-nums", textColor)}>
                    {res.current.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-500/40">
                    / {res.max.toLocaleString()} {res.unit}
                  </span>
                </div>
              </div>

              <div className="h-2 rounded-full bg-cyan-500/10 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", barColor)}
                  style={{ width: `${pct}%`, opacity: 0.8 }}
                />
              </div>

              <div className="flex justify-end mt-0.5">
                <span className={cn("text-[10px] font-mono tabular-nums", textColor)}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
