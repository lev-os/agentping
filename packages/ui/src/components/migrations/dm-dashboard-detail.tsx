"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DmDashboardConfig {
  name: string;
  command: string;
  cwd: string;
  port_range: [number, number];
  health_check?: {
    type: string;
    path?: string;
    timeout_ms?: number;
  };
}

export interface DmDashboardStatus {
  status: "starting" | "online" | "failed" | "stopped";
  healthy?: boolean;
  port?: number;
  pid?: number;
  restartAttempts: number;
  startedAt?: string;
}

export interface DmDashboard {
  id: string;
  config: DmDashboardConfig;
  status: DmDashboardStatus;
}

export interface DmDashboardMetrics {
  uptime_ms: number;
  restarts: number;
}

export interface DmDashboardDetailProps {
  dashboard: DmDashboard;
  metrics?: DmDashboardMetrics;
  onBack?: () => void;
  onRestart?: () => Promise<void> | void;
  onOpen?: () => void;
  className?: string;
}

/**
 * DmDashboardDetail - Migrated from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/DashboardDetail.tsx
 * @migration-status candidate
 * @needs-review Original uses react-router, useWebSocket, dashboardAPI; migration is prop-driven
 */
export function DmDashboardDetail({
  dashboard,
  metrics,
  onBack,
  onRestart,
  onOpen,
  className,
}: DmDashboardDetailProps) {
  const [isRestarting, setIsRestarting] = React.useState(false);

  const handleRestart = async () => {
    if (!onRestart) return;
    setIsRestarting(true);
    try {
      await onRestart();
    } finally {
      setIsRestarting(false);
    }
  };

  const displayStatus =
    dashboard.status.status === "online" && dashboard.status.healthy === false
      ? "unhealthy"
      : dashboard.status.status;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-cyan-500/60 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-white">{dashboard.config.name}</h1>
            <code className="text-xs font-mono text-cyan-500/50">{dashboard.id}</code>
          </div>
        </div>
        <div className="flex gap-2">
          {onOpen && (
            <button onClick={onOpen} disabled={!dashboard.status.port}
              className="px-3 py-1.5 text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500/30 transition-colors disabled:opacity-40">
              Open Dashboard
            </button>
          )}
          {onRestart && (
            <button onClick={handleRestart} disabled={isRestarting}
              className="px-3 py-1.5 text-xs font-mono bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 transition-colors disabled:opacity-40">
              {isRestarting ? "Restarting..." : "Restart"}
            </button>
          )}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/5">
        <div><span className="text-xs text-white/40 block">Status</span><span className="text-sm font-mono text-white/80">{displayStatus}</span></div>
        <div><span className="text-xs text-white/40 block">Port</span><span className="text-sm font-mono text-white/80">{dashboard.status.port || "-"}</span></div>
        <div><span className="text-xs text-white/40 block">PID</span><span className="text-sm font-mono text-white/80">{dashboard.status.pid || "-"}</span></div>
        <div><span className="text-xs text-white/40 block">Restarts</span><span className="text-sm font-mono text-white/80">{dashboard.status.restartAttempts}</span></div>
        {dashboard.status.startedAt && (
          <div><span className="text-xs text-white/40 block">Started</span><span className="text-sm font-mono text-white/80">{new Date(dashboard.status.startedAt).toLocaleString()}</span></div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
        <h2 className="text-sm font-semibold text-white/80 mb-3">Settings</h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-white/40 block">Port Range</span><span className="font-mono text-white/70">{dashboard.config.port_range[0]} - {dashboard.config.port_range[1]}</span></div>
          <div><span className="text-white/40 block">Command</span><code className="font-mono text-cyan-400/80">{dashboard.config.command}</code></div>
          <div className="col-span-2"><span className="text-white/40 block">Working Directory</span><code className="font-mono text-cyan-400/80">{dashboard.config.cwd}</code></div>
          {dashboard.config.health_check && (
            <>
              <div><span className="text-white/40 block">Health Check</span><span className="font-mono text-white/70">{dashboard.config.health_check.type}</span></div>
              {dashboard.config.health_check.path && (
                <div><span className="text-white/40 block">Health Path</span><code className="font-mono text-cyan-400/80">{dashboard.config.health_check.path}</code></div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Metrics placeholder */}
      {metrics && (
        <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <h2 className="text-sm font-semibold text-white/80 mb-3">Metrics</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div><span className="text-white/40 block">Uptime</span><span className="text-lg font-bold text-green-400 font-mono">{formatUptime(metrics.uptime_ms)}</span></div>
            <div><span className="text-white/40 block">Total Restarts</span><span className="text-lg font-bold text-yellow-400 font-mono">{metrics.restarts}</span></div>
          </div>
        </div>
      )}
    </div>
  );
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
