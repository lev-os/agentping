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

export interface PrimitivesGalleryProps {
  className?: string;
  initialSection?: string;
}

const SECTIONS = [
  { id: "ai", Component: GalleryAISection },
  { id: "content", Component: GalleryContentSection },
  { id: "dashboard", Component: GalleryDashboardSection },
  { id: "data", Component: GalleryDataSection },
  { id: "feedback", Component: GalleryFeedbackSection },
  { id: "finance", Component: GalleryFinanceSection },
  { id: "forms", Component: GalleryFormsSection },
  { id: "interaction", Component: GalleryInteractionSection },
  { id: "logs", Component: GalleryLogsSection },
  { id: "media", Component: GalleryMediaSection },
  { id: "navigation", Component: GalleryNavigationSection },
  { id: "scheduling", Component: GallerySchedulingSection },
  { id: "sofia", Component: GallerySofiaSection },
  { id: "system", Component: GallerySystemSection },
  { id: "visuals", Component: GalleryVisualsSection },
] as const;

export function PrimitivesGallery({ className, initialSection }: PrimitivesGalleryProps) {
  React.useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(`gallery-section-${initialSection}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialSection]);

  return (
    <div className={cn("space-y-8 p-4", className)}>
      <div className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Primitives Gallery</div>
      {SECTIONS.map(({ id, Component }) => (
        <div key={id} id={`gallery-section-${id}`}>
          <Component />
        </div>
      ))}
    </div>
  );
}
