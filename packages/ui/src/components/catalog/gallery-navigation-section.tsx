"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { Breadcrumbs } from "./breadcrumbs";
import { Pagination } from "./pagination";
import { SegmentedControl } from "./segmented-control";
import { TabsContainer } from "./tabs-container";
import { RadialNav } from "./radial-nav";
import { Stepper } from "./stepper";

export interface GalleryNavigationSectionProps { className?: string; }

export function GalleryNavigationSection({ className }: GalleryNavigationSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Navigation Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="Breadcrumbs">
          <Breadcrumbs path={["Home", "Projects", "AgentPing", "Settings"]} />
        </GalleryCard>
        <GalleryCard name="Pagination">
          <Pagination currentPage={3} totalPages={7} />
        </GalleryCard>
        <GalleryCard name="SegmentedControl">
          <SegmentedControl options={["Agents", "Tasks", "Logs"]} selected="Agents" />
        </GalleryCard>
        <GalleryCard name="TabsContainer">
          <TabsContainer
            tabs={[
              { id: "overview", label: "Overview", content: <span className="text-xs text-cyan-300">System overview</span> },
              { id: "metrics", label: "Metrics" },
              { id: "logs", label: "Logs" },
            ]}
            activeTab="overview"
          />
        </GalleryCard>
        <GalleryCard name="RadialNav">
          <RadialNav
            size={140}
            items={[
              { id: "deploy", label: "Deploy", icon: "\u25B6" },
              { id: "monitor", label: "Monitor", icon: "\u25C9" },
              { id: "logs", label: "Logs", icon: "\u2630" },
              { id: "config", label: "Config", icon: "\u2699" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="Stepper">
          <Stepper steps={["Connect", "Configure", "Deploy"]} currentStep={1} />
        </GalleryCard>
      </div>
    </div>
  );
}
