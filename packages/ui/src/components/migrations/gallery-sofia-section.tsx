"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { SonarDisplay } from "./sonar-display";

export interface GallerySofiaSectionProps { className?: string; }

export function GallerySofiaSection({ className }: GallerySofiaSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">Sofia Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="SonarDisplay">
          <SonarDisplay
            size={120}
            pings={[
              { angle: 45, distance: 60 },
              { angle: 160, distance: 80 },
              { angle: 270, distance: 40 },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="SofiaChat" shell>
          <div />
        </GalleryCard>
        <GalleryCard name="SofiaCanvas" shell>
          <div />
        </GalleryCard>
        <GalleryCard name="SofiaDashboard" shell>
          <div />
        </GalleryCard>
        <GalleryCard name="SofiaRecipes" shell>
          <div />
        </GalleryCard>
      </div>
    </div>
  );
}
