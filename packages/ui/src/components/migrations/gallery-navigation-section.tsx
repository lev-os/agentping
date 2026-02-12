"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { Breadcrumbs } from "./breadcrumbs";
import { Pagination } from "./pagination";
import { SegmentedControl } from "./segmented-control";
import { TabsContainer } from "./tabs-container";
import { SidePanel } from "./side-panel";
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
        <GalleryCard name="SegmentedControl" shell>
          <SegmentedControl />
        </GalleryCard>
        <GalleryCard name="TabsContainer" shell>
          <TabsContainer />
        </GalleryCard>
        <GalleryCard name="SidePanel" shell>
          <SidePanel />
        </GalleryCard>
        <GalleryCard name="RadialNav" shell>
          <RadialNav />
        </GalleryCard>
        <GalleryCard name="Stepper" shell>
          <Stepper />
        </GalleryCard>
      </div>
    </div>
  );
}
