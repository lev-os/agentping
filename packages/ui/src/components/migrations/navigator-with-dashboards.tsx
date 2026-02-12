"use client";

/**
 * NavigatorWithDashboards — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/NavigatorWithDashboards.tsx
 * @migration-status needs-review — runtime coupled (dashboard-manager API)
 * @category root
 */

import React from "react";
import {
  Activity,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DashboardHealthStatus =
  | "online"
  | "offline"
  | "checking"
  | "restarting"
  | "failed";

export interface DashboardItem {
  id: string;
  name: string;
  url: string;
  port: number;
  status: DashboardHealthStatus;
  description?: string;
  restartAttempts?: number;
}

export interface NavigatorWithDashboardsProps {
  /** Dashboard list (original fetches from API; migration accepts as props) */
  dashboards?: DashboardItem[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Dashboard select handler */
  onSelectDashboard?: (dashboardId: string) => void;
  /** Open dashboard URL */
  onOpenDashboard?: (url: string) => void;
  /** Restart a dashboard */
  onRestartDashboard?: (dashboardId: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status helpers                                                      */
/* ------------------------------------------------------------------ */

const STATUS_ICONS: Record<DashboardHealthStatus, React.ReactNode> = {
  online: <CheckCircle2 size={16} className="text-emerald-400" />,
  offline: <XCircle size={16} className="text-zinc-500" />,
  checking: <AlertCircle size={16} className="text-zinc-400 animate-pulse" />,
  restarting: <RotateCw size={16} className="text-amber-400 animate-spin" />,
  failed: <XCircle size={16} className="text-red-400" />,
};

const STATUS_LABELS: Record<DashboardHealthStatus, string> = {
  online: "ONLINE",
  offline: "OFFLINE",
  checking: "CHECKING...",
  restarting: "RESTARTING...",
  failed: "FAILED",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function NavigatorWithDashboards({
  dashboards = [],
  loading = false,
  error = null,
  onSelectDashboard,
  onOpenDashboard,
  onRestartDashboard,
  className,
}: NavigatorWithDashboardsProps) {
  const onlineCount = dashboards.filter((d) => d.status === "online").length;

  return (
    <div className={cn("flex flex-col h-full animate-in fade-in duration-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-cyan-500" />
          <h2 className="text-sm font-semibold text-zinc-100">Dashboard Navigator</h2>
        </div>
        <span
          className={cn(
            "text-xs font-mono",
            onlineCount === dashboards.length ? "text-emerald-400" : "text-amber-400",
          )}
        >
          {onlineCount}/{dashboards.length} ONLINE
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-xs text-zinc-500">
          <RotateCw size={14} className="animate-spin mr-2" />
          Loading dashboard status...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-xs text-red-400">
          Dashboard API error: {error}
        </div>
      )}

      {/* Dashboard grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              className={cn(
                "rounded-xl border bg-zinc-900/50",
                "cursor-pointer transition-all duration-150",
                "hover:bg-zinc-800/50",
                dashboard.status === "online"
                  ? "border-emerald-500/20 hover:border-emerald-500/30"
                  : dashboard.status === "failed"
                    ? "border-red-500/20"
                    : "border-zinc-700/30",
              )}
              onClick={() => {
                if (dashboard.status === "online") {
                  onOpenDashboard?.(dashboard.url);
                }
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-sm font-medium text-zinc-200 truncate">
                    {dashboard.name}
                  </h3>
                  {dashboard.status === "online" && (
                    <ExternalLink size={12} className="text-zinc-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {STATUS_ICONS[dashboard.status]}
                  <span className="text-[10px] text-zinc-500">
                    {STATUS_LABELS[dashboard.status]}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-4 pb-3 space-y-1.5">
                {dashboard.description && (
                  <p className="text-xs text-zinc-500">{dashboard.description}</p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                  <span>PORT {dashboard.port}</span>
                  <code className="truncate">{dashboard.url}</code>
                </div>
                {(dashboard.restartAttempts ?? 0) > 0 && (
                  <span className="text-[10px] text-amber-500">
                    Restart attempts: {dashboard.restartAttempts}
                  </span>
                )}
              </div>

              {/* Card footer */}
              <div className="flex items-center gap-2 px-4 py-2 border-t border-zinc-800/50">
                {dashboard.status === "online" && (
                  <span className="text-[10px] text-zinc-500">Click to open</span>
                )}
                {(dashboard.status === "offline" || dashboard.status === "failed") &&
                  onRestartDashboard && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestartDashboard(dashboard.id);
                      }}
                      className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <RotateCw size={10} />
                      Restart
                    </button>
                  )}
                {onSelectDashboard && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDashboard(dashboard.id);
                    }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 ml-auto transition-colors"
                  >
                    Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
