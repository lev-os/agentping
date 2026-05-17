"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { StatsGrid } from "./stats-grid";
import { StatusCard } from "./status-card";
import { ProgressBar } from "./progress-bar";
import { ResourceGauge } from "./resource-gauge";
import { SystemHealthGauge } from "./system-health-gauge";
import { StorageDistribution } from "./storage-distribution";

export interface GalleryDashboardSectionProps {
  className?: string;
}

export function GalleryDashboardSection({ className }: GalleryDashboardSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Dashboard Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="StatsGrid">
          <StatsGrid
            columns={2}
            stats={[
              { label: "Agents", value: "12", change: 8 },
              { label: "Tasks", value: "347", change: -2 },
              { label: "Uptime", value: "99.7%" },
              { label: "Latency", value: "42ms", change: -15 },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="StatusCard">
          <div className="flex flex-col gap-2">
            <StatusCard title="API" value="Operational" status="success" />
            <StatusCard title="Queue" value="3 pending" status="warning" />
          </div>
        </GalleryCard>

        <GalleryCard name="ProgressBar">
          <div className="flex flex-col gap-3">
            <ProgressBar value={72} label="Training" variant="default" />
            <ProgressBar value={100} label="Upload" variant="success" />
            <ProgressBar value={45} label="Memory" variant="warning" />
          </div>
        </GalleryCard>

        <GalleryCard name="ResourceGauge">
          <ResourceGauge />
        </GalleryCard>

        <GalleryCard name="SystemHealthGauge">
          <SystemHealthGauge
            metrics={[
              { label: "CPU", value: 62, unit: "%", status: "ok" },
              { label: "Memory", value: 78, unit: "%", status: "warning" },
              { label: "Disk", value: 45, unit: "%", status: "ok" },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="StorageDistribution">
          <StorageDistribution
            segments={[
              { label: "Models", value: 45, color: "#06b6d4" },
              { label: "Logs", value: 25, color: "#f59e0b" },
              { label: "Cache", value: 15, color: "#10b981" },
              { label: "Other", value: 15, color: "#8b5cf6" },
            ]}
          />
        </GalleryCard>
      </div>
    </div>
  );
}
