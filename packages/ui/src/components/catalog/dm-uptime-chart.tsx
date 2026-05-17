"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DmUptimeChartProps {
  uptimeMs: number;
  className?: string;
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * DmUptimeChart - Catalog component from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/charts/UptimeChart.tsx
 * @catalog-status candidate
 * @needs-review Original uses recharts AreaChart; catalog version uses CSS bar visualization
 */
export function DmUptimeChart({ uptimeMs, className }: DmUptimeChartProps) {
  const uptimeHours = uptimeMs / (1000 * 60 * 60);
  const bars = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    pct: Math.min(100, (Math.min(uptimeHours, i + 1) / 24) * 100),
  }));

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <h3 className="text-sm font-semibold text-white/80 mb-4">
        Uptime: {formatUptime(uptimeMs)}
      </h3>
      <div className="flex items-end gap-px h-[160px]">
        {bars.map((bar) => (
          <div
            key={bar.hour}
            className="flex-1 bg-green-500/60 rounded-t transition-all duration-300"
            style={{ height: `${bar.pct}%` }}
            title={`${bar.hour}h`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[10px] font-mono text-white/30">
        <span>0h</span>
        <span>12h</span>
        <span>24h</span>
      </div>
    </div>
  );
}
