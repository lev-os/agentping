"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Alert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  source: string;
}

export interface AlertFeedProps {
  alerts?: Alert[];
  title?: string;
  className?: string;
}

const severityColors: Record<string, string> = {
  critical: "border-red-500 bg-red-500/10",
  high: "border-orange-500 bg-orange-500/10",
  medium: "border-yellow-500 bg-yellow-500/10",
  low: "border-cyan-500 bg-cyan-500/10",
};

const severityBadge: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-cyan-500 text-black",
};

/**
 * AlertFeed - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/AlertFeed.tsx
 * @catalog-status candidate
 */
export function AlertFeed({ alerts = [], title, className }: AlertFeedProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "ALERT FEED"}</span>
        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">{alerts.length}</span>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-cyan-500/5">
        {alerts.map((alert) => (
          <div key={alert.id} className={cn("px-4 py-2 border-l-2", severityColors[alert.severity])}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[10px] font-mono uppercase px-1.5 py-0.5 rounded", severityBadge[alert.severity])}>
                {alert.severity}
              </span>
              <span className="text-[10px] font-mono text-cyan-500/40">{alert.source}</span>
              <span className="text-[10px] font-mono text-cyan-500/40 ml-auto">{alert.timestamp}</span>
            </div>
            <div className="text-xs font-mono text-cyan-300">{alert.title}</div>
            <div className="text-xs font-mono text-cyan-500/60 mt-0.5">{alert.message}</div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="px-4 py-8 text-center text-xs font-mono text-cyan-500/40">
            <span className="text-green-400 mr-1">{"\u2713"}</span> NO ALERTS
          </div>
        )}
      </div>
    </div>
  );
}
