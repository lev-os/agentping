import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { PrimitivesGallery } from "../../../components/catalog/primitives-gallery";
import { GalleryAISection } from "../../../components/catalog/gallery-ai-section";
import { GalleryContentSection } from "../../../components/catalog/gallery-content-section";
import { GalleryDashboardSection } from "../../../components/catalog/gallery-dashboard-section";
import { GalleryDataSection } from "../../../components/catalog/gallery-data-section";
import { GalleryFeedbackSection } from "../../../components/catalog/gallery-feedback-section";
import { GalleryFinanceSection } from "../../../components/catalog/gallery-finance-section";
import { GalleryFormsSection } from "../../../components/catalog/gallery-forms-section";
import { GalleryInteractionSection } from "../../../components/catalog/gallery-interaction-section";
import { GalleryLogsSection } from "../../../components/catalog/gallery-logs-section";
import { GalleryMediaSection } from "../../../components/catalog/gallery-media-section";
import { GalleryNavigationSection } from "../../../components/catalog/gallery-navigation-section";
import { GallerySchedulingSection } from "../../../components/catalog/gallery-scheduling-section";
import { GallerySofiaSection } from "../../../components/catalog/gallery-sofia-section";
import { GallerySystemSection } from "../../../components/catalog/gallery-system-section";
import { GalleryVisualsSection } from "../../../components/catalog/gallery-visuals-section";

const meta: Meta = {
  title: "Review/Domain/Gallery",
};
export default meta;

type Story = StoryObj;

function HollowCard({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-4 border border-gray-500/20 rounded-lg bg-black/40">
      <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">
        HOLLOW
      </span>
      <div className="text-[10px] text-cyan-500/50 mb-2">{name}</div>
      {children}
    </div>
  );
}

const GALLERY_SECTIONS = [
  { name: "GalleryAISection", Component: GalleryAISection },
  { name: "GalleryContentSection", Component: GalleryContentSection },
  { name: "GalleryDashboardSection", Component: GalleryDashboardSection },
  { name: "GalleryDataSection", Component: GalleryDataSection },
  { name: "GalleryFeedbackSection", Component: GalleryFeedbackSection },
  { name: "GalleryFinanceSection", Component: GalleryFinanceSection },
  { name: "GalleryFormsSection", Component: GalleryFormsSection },
  { name: "GalleryInteractionSection", Component: GalleryInteractionSection },
  { name: "GalleryLogsSection", Component: GalleryLogsSection },
  { name: "GalleryMediaSection", Component: GalleryMediaSection },
  { name: "GalleryNavigationSection", Component: GalleryNavigationSection },
  { name: "GallerySchedulingSection", Component: GallerySchedulingSection },
  { name: "GallerySofiaSection", Component: GallerySofiaSection },
  { name: "GallerySystemSection", Component: GallerySystemSection },
  { name: "GalleryVisualsSection", Component: GalleryVisualsSection },
] as const;

export const FullGallery: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Primitives Gallery
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            Master gallery component rendering all 15 sections
          </p>
        </div>
        <PrimitivesGallery />
      </div>
    </div>
  ),
};

export const SectionsGrid: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Gallery Sections (Individual)
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            16 HOLLOW gallery section components rendered individually
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">
              HOLLOW
            </span>
            <span className="text-[9px] text-gray-500">
              Gallery sections wrap inner components but have minimal unique logic
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {GALLERY_SECTIONS.map(({ name, Component }) => (
            <HollowCard key={name} name={name}>
              <Component />
            </HollowCard>
          ))}
        </div>
      </div>
    </div>
  ),
};
