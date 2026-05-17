"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SystemMetric {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  status?: "ok" | "warning" | "critical";
}

export interface SystemHealthGaugeProps {
  metrics?: SystemMetric[];
  title?: string;
  className?: string;
}

/**
 * SystemHealthGauge - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/SystemHealthGauge.tsx
 * @catalog-status candidate
 */
export function SystemHealthGauge({ metrics = [], title, className }: SystemHealthGaugeProps) {
  const statusColors: Record<string, string> = {
    ok: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">{title || "SYSTEM HEALTH"}</div>
      <div className="space-y-3">
        {metrics.map((m) => {
          const pct = m.max ? (m.value / m.max) * 100 : m.value;
          const status = m.status || (pct > 90 ? "critical" : pct > 70 ? "warning" : "ok");
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-cyan-300/80">{m.label}</span>
                <span className="text-xs font-mono text-cyan-500/60">
                  {m.value}{m.unit || "%"}{m.max ? ` / ${m.max}${m.unit || "%"}` : ""}
                </span>
              </div>
              <div className="h-1.5 bg-black/40 rounded-full">
                <div className={cn("h-full rounded-full transition-all", statusColors[status])} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
