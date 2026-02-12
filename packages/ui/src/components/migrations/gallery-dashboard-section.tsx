"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { StatsGrid } from "./stats-grid";
import { StatusCard } from "./status-card";
import { ProgressBar } from "./progress-bar";
import { ResourceGauge } from "./resource-gauge";

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

        <GalleryCard name="SystemHealthGauge" shell />
        <GalleryCard name="StorageDistribution" shell />
      </div>
    </div>
  );
}
