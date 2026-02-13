"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DmDashboardSummary {
  id: string;
  config: { name: string; port_range: [number, number] };
  status: {
    status: "starting" | "online" | "failed" | "stopped";
    healthy?: boolean;
    port?: number;
    pid?: number;
    restartAttempts: number;
    startedAt?: string;
  };
}

export interface DmDashboardListProps {
  dashboards?: DmDashboardSummary[];
  isLoading?: boolean;
  error?: string | null;
  onRowClick?: (dashboard: DmDashboardSummary) => void;
  onViewDetails?: (dashboardId: string) => void;
  onCreateNew?: () => void;
  onRetry?: () => void;
  className?: string;
}

function formatUptime(startTime: Date): string {
  const ms = Date.now() - startTime.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

const statusColors: Record<string, string> = {
  starting: "text-yellow-400",
  online: "text-green-400",
  failed: "text-red-400",
  stopped: "text-zinc-400",
  unhealthy: "text-orange-400",
};

/**
 * DmDashboardList - Migrated from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/DashboardList.tsx
 * @migration-status candidate
 * @needs-review Original uses react-router, useWebSocket, dashboardAPI; migration is prop-driven
 */
export function DmDashboardList({
  dashboards = [],
  isLoading,
  error,
  onRowClick,
  onViewDetails,
  onCreateNew,
  onRetry,
  className,
}: DmDashboardListProps) {
  if (isLoading) {
    return (
      <div className={cn("text-center py-12 text-cyan-500/40 font-mono text-sm", className)}>
        Loading dashboards...
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-red-400/80 font-mono text-sm mb-2">Error: {error}</p>
        {onRetry && (
          <button onClick={onRetry} className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Dashboards</h1>
        {onCreateNew && (
          <button onClick={onCreateNew}
            className="px-3 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors">
            + New Dashboard
          </button>
        )}
      </div>

      {dashboards.length === 0 ? (
        <div className="text-center py-12 text-cyan-500/30 font-mono text-sm">
          <p>No dashboards yet</p>
          {onCreateNew && (
            <button onClick={onCreateNew} className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              Create your first dashboard
            </button>
          )}
        </div>
      ) : (
        <div className="border border-cyan-500/10 rounded-lg overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-500/10 bg-black/40 text-left text-cyan-500/40 uppercase tracking-wider">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Port</th>
                <th className="px-3 py-2">PID</th>
                <th className="px-3 py-2">Uptime</th>
                <th className="px-3 py-2">Restarts</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.map((d) => {
                const displayStatus = d.status.status === "online" && d.status.healthy === false ? "unhealthy" : d.status.status;
                return (
                  <tr key={d.id}
                    className="border-b border-cyan-500/5 hover:bg-cyan-500/5 cursor-pointer transition-colors"
                    role="button"
                    aria-label={`Select dashboard ${d.config.name}`}
                    tabIndex={0}
                    onClick={() => onRowClick?.(d)}>
                    <td className="px-3 py-2">
                      <div className="text-cyan-300">{d.config.name}</div>
                      <div className="text-cyan-500/30">{d.id}</div>
                    </td>
                    <td className={cn("px-3 py-2", statusColors[displayStatus])}>{displayStatus}</td>
                    <td className="px-3 py-2 text-white/60">{d.status.port || "-"}</td>
                    <td className="px-3 py-2 text-white/60">{d.status.pid || "-"}</td>
                    <td className="px-3 py-2 text-white/60">
                      {d.status.startedAt ? formatUptime(new Date(d.status.startedAt)) : "-"}
                    </td>
                    <td className="px-3 py-2 text-white/60">{d.status.restartAttempts}</td>
                    <td className="px-3 py-2">
                      {onViewDetails && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewDetails(d.id); }}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          aria-label={`View details for ${d.config.name}`}>
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
