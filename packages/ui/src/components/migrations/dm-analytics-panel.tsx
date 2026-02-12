"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface Dashboard {
  status: {
    status: string;
    restartAttempts: number;
  };
}

export interface DmAnalyticsPanelProps {
  dashboards: Dashboard[];
  className?: string;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className="text-sm text-white/50 mb-2">{label}</div>
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

/**
 * DmAnalyticsPanel - Migrated from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/AnalyticsPanel.tsx
 * @migration-status candidate
 */
export function DmAnalyticsPanel({ dashboards, className }: DmAnalyticsPanelProps) {
  const totalDashboards = dashboards.length;
  const onlineDashboards = dashboards.filter((d) => d.status.status === "online").length;
  const totalRestarts = dashboards.reduce((sum, d) => sum + d.status.restartAttempts, 0);
  const failedDashboards = dashboards.filter((d) => d.status.status === "failed").length;

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8 p-4 bg-white/[0.02] rounded-lg border border-white/5",
        className,
      )}
    >
      <StatCard label="Total Dashboards" value={totalDashboards} color="#3b82f6" />
      <StatCard label="Online" value={onlineDashboards} color="#22c55e" />
      <StatCard label="Total Restarts" value={totalRestarts} color="#f59e0b" />
      <StatCard label="Failed" value={failedDashboards} color="#ef4444" />
    </div>
  );
}
