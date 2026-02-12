"use client";

/**
 * Dashboard — Migration candidate from Studio
 *
 * Mission Control dashboard with system telemetry, agent squad,
 * activity stream, and quick operations.
 *
 * @source packages/studio/src/renderer/components/Dashboard.tsx
 * @migration-status needs-review — runtime coupled (window.coordinator, window.agentPing, window.claudeCode)
 * @category root
 */

import React from "react";
import {
  Activity,
  Bot,
  Cpu,
  HardDrive,
  Loader2,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SystemTelemetry {
  cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  uptime: string;
}

export interface QuickOperation {
  id: string;
  label: string;
  icon: React.ReactNode;
  action?: () => void;
}

export interface DashboardProps {
  /** System telemetry data */
  telemetry?: SystemTelemetry;
  /** Quick operations */
  quickOps?: QuickOperation[];
  /** Recent activity events */
  recentActivity?: Array<{ id: string; title: string; time: string }>;
  /** Whether data is loading */
  loading?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Stat card helper                                                    */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("text-zinc-400", color)}>{icon}</span>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-100 tabular-nums">{value}</div>
      {subValue && (
        <div className="text-xs text-zinc-500 mt-1">{subValue}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Dashboard({
  telemetry,
  quickOps = [],
  recentActivity = [],
  loading = false,
  className,
}: DashboardProps) {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-cyan-500 animate-spin" />
          <span className="text-sm text-zinc-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 p-6 h-full overflow-y-auto", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Zap size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Mission Control</h1>
          <p className="text-xs text-zinc-500">System overview and quick operations</p>
        </div>
      </div>

      {/* Telemetry grid */}
      {telemetry && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Cpu size={16} />}
            label="CPU Usage"
            value={`${telemetry.cpuUsage}%`}
            color="text-cyan-400"
          />
          <StatCard
            icon={<HardDrive size={16} />}
            label="Memory"
            value={`${telemetry.memoryUsage}%`}
            color="text-purple-400"
          />
          <StatCard
            icon={<Bot size={16} />}
            label="Active Agents"
            value={telemetry.activeAgents}
            subValue={`${telemetry.totalTasks} tasks total`}
          />
          <StatCard
            icon={<Activity size={16} />}
            label="Completed"
            value={telemetry.completedTasks}
            subValue={`Uptime: ${telemetry.uptime}`}
            color="text-emerald-400"
          />
        </div>
      )}

      {/* Quick operations */}
      {quickOps.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Quick Operations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickOps.map((op) => (
              <button
                key={op.id}
                onClick={op.action}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl",
                  "bg-zinc-800/30 border border-zinc-700/30",
                  "text-sm text-zinc-300 hover:text-zinc-100",
                  "hover:bg-zinc-800/50 hover:border-zinc-600/30",
                  "transition-all duration-150",
                )}
              >
                <span className="text-cyan-400">{op.icon}</span>
                {op.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Recent Activity
          </h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800/50">
            {recentActivity.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-xs text-zinc-300">{event.title}</span>
                <span className="text-[10px] text-zinc-600">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
