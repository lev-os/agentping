"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryAISection } from "./gallery-ai-section";
import { GalleryContentSection } from "./gallery-content-section";
import { GalleryDashboardSection } from "./gallery-dashboard-section";
import { GalleryDataSection } from "./gallery-data-section";
import { GalleryFeedbackSection } from "./gallery-feedback-section";
import { GalleryFinanceSection } from "./gallery-finance-section";
import { GalleryFormsSection } from "./gallery-forms-section";
import { GalleryInteractionSection } from "./gallery-interaction-section";
import { GalleryLogsSection } from "./gallery-logs-section";
import { GalleryMediaSection } from "./gallery-media-section";
import { GalleryNavigationSection } from "./gallery-navigation-section";
import { GallerySchedulingSection } from "./gallery-scheduling-section";
import { GallerySofiaSection } from "./gallery-sofia-section";
import { GallerySystemSection } from "./gallery-system-section";
import { GalleryVisualsSection } from "./gallery-visuals-section";

export interface PrimitivesGalleryProps { className?: string; }

export function PrimitivesGallery({ className }: PrimitivesGalleryProps) {
  return (
    <div className={cn("space-y-8 p-4", className)}>
      <div className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Primitives Gallery</div>
      <GalleryAISection />
      <GalleryContentSection />
      <GalleryDashboardSection />
      <GalleryDataSection />
      <GalleryFeedbackSection />
      <GalleryFinanceSection />
      <GalleryFormsSection />
      <GalleryInteractionSection />
      <GalleryLogsSection />
      <GalleryMediaSection />
      <GalleryNavigationSection />
      <GallerySchedulingSection />
      <GallerySofiaSection />
      <GallerySystemSection />
      <GalleryVisualsSection />
    </div>
  );
}
