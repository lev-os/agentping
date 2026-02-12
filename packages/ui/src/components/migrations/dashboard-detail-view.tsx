"use client";

/**
 * DashboardDetailView — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/DashboardDetailView.tsx
 * @migration-status needs-review — runtime coupled (window.electron, dashboard metrics API)
 * @category root
 */

import React from "react";
import {
  ArrowLeft,
  Activity,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface DashboardMetricSummary {
  uptime: string;
  restartCount: number;
  avgResponseTime?: string;
  status: "online" | "offline" | "failed";
  port: number;
  url: string;
}

export interface DashboardDetailViewProps {
  /** Dashboard identifier */
  dashboardId: string;
  /** Dashboard display name */
  name?: string;
  /** Dashboard metrics */
  metrics?: DashboardMetricSummary;
  /** Back navigation handler */
  onBack?: () => void;
  /** Open in browser handler */
  onOpenExternal?: (url: string) => void;
  /** Restart handler */
  onRestart?: () => void;
  /** Whether data is loading */
  loading?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DashboardDetailView({
  dashboardId,
  name,
  metrics,
  onBack,
  onOpenExternal,
  onRestart,
  loading = false,
  className,
}: DashboardDetailViewProps) {
  const displayName = name ?? dashboardId;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-zinc-100 truncate">
            {displayName}
          </h2>
          <p className="text-xs text-zinc-500">{dashboardId}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {onRestart && (
            <button
              onClick={onRestart}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs",
                "bg-zinc-800/50 border border-zinc-700/50",
                "text-zinc-400 hover:text-zinc-200 transition-colors",
              )}
            >
              <RefreshCw size={12} />
              Restart
            </button>
          )}
          {metrics?.url && onOpenExternal && (
            <button
              onClick={() => onOpenExternal(metrics.url)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs",
                "bg-cyan-600/20 border border-cyan-500/20",
                "text-cyan-400 hover:bg-cyan-600/30 transition-colors",
              )}
            >
              <ExternalLink size={12} />
              Open
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs text-zinc-500">
            <div className="w-4 h-4 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin mr-2" />
            Loading metrics...
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Status + metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <span className="text-xs text-zinc-500">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      metrics.status === "online" && "bg-emerald-400",
                      metrics.status === "offline" && "bg-zinc-500",
                      metrics.status === "failed" && "bg-red-400",
                    )}
                  />
                  <span className="text-sm font-medium text-zinc-200 uppercase">
                    {metrics.status}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <span className="text-xs text-zinc-500">Port</span>
                <div className="text-sm font-medium text-zinc-200 mt-1 font-mono">
                  {metrics.port}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <span className="text-xs text-zinc-500">Uptime</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={12} className="text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-200">
                    {metrics.uptime}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <span className="text-xs text-zinc-500">Restarts</span>
                <div className="text-sm font-medium text-zinc-200 mt-1">
                  {metrics.restartCount}
                </div>
              </div>
            </div>

            {/* Chart placeholders */}
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Charts
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-xs text-zinc-600">
                  <Activity size={16} className="mr-2" />
                  Uptime chart placeholder — connect recharts or visual shell
                </div>
                <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-xs text-zinc-600">
                  <Activity size={16} className="mr-2" />
                  Restart histogram placeholder — connect recharts or visual shell
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-xs text-zinc-500">
            No metrics available
          </div>
        )}
      </div>
    </div>
  );
}
