import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
// HOLLOW - Gallery sections
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
// SHELL - Visual effect components
import { GlobeWireframe } from "../../../components/catalog/globe-wireframe";
import { StarField } from "../../../components/catalog/star-field";
import { ParticleStream } from "../../../components/catalog/particle-stream";
import { RadarSweep } from "../../../components/catalog/radar-sweep";
import { CircuitPattern } from "../../../components/catalog/circuit-pattern";
import { SonarDisplay } from "../../../components/catalog/sonar-display";
import { HexGridBackground } from "../../../components/catalog/hex-grid-background";
import { SignalMonitor } from "../../../components/catalog/signal-monitor";

const meta: Meta = {
  title: "Review/Overlays/Placeholders",
};
export default meta;

type Story = StoryObj;

const HOLLOW_SECTIONS = [
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

const SHELL_COMPONENTS = [
  { name: "GlobeWireframe", el: <GlobeWireframe size={120} /> },
  { name: "StarField", el: <div className="h-[120px] relative overflow-hidden rounded"><StarField count={60} /></div> },
  { name: "ParticleStream", el: <div className="h-[120px] relative overflow-hidden rounded"><ParticleStream count={20} /></div> },
  { name: "RadarSweep", el: <RadarSweep size={120} blips={[{ angle: 45, distance: 0.6, label: "Alpha" }, { angle: 180, distance: 0.3 }]} /> },
  { name: "CircuitPattern", el: <div className="h-[120px]"><CircuitPattern /></div> },
  { name: "SonarDisplay", el: <SonarDisplay size={120} pings={[{ angle: 30, distance: 0.5 }, { angle: 150, distance: 0.8 }]} /> },
  { name: "HexGridBackground", el: <div className="h-[120px]"><HexGridBackground opacity={0.3} /></div> },
  {
    name: "SignalMonitor",
    el: (
      <SignalMonitor
        channels={[
          { id: "1", name: "Ch-1", frequency: "2.4 GHz", strength: 85, active: true },
          { id: "2", name: "Ch-2", frequency: "5.0 GHz", strength: 42, active: true },
          { id: "3", name: "Ch-3", frequency: "900 MHz", strength: 10, active: false },
        ]}
      />
    ),
  },
] as const;

export const AllPlaceholders: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Placeholder Components
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            16 HOLLOW gallery sections + 8 SHELL visual effect components
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-gray-500/20 text-gray-400">
                HOLLOW
              </span>
              <span className="text-[9px] text-gray-500">
                Gallery wrappers with minimal unique logic
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/20 text-amber-400">
                SHELL
              </span>
              <span className="text-[9px] text-gray-500">
                Visual effects with simplified rendering
              </span>
            </div>
          </div>
        </div>

        {/* HOLLOW Section */}
        <div>
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4">
            HOLLOW Components (16)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {HOLLOW_SECTIONS.map(({ name, Component }) => (
              <div
                key={name}
                className="relative p-4 border border-gray-500/20 rounded-lg bg-black/40"
              >
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] rounded bg-gray-500/20 text-gray-400">
                  HOLLOW
                </span>
                <div className="text-[10px] text-cyan-500/50 mb-2 font-mono">{name}</div>
                <Component />
              </div>
            ))}
          </div>
        </div>

        {/* SHELL Section */}
        <div>
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4">
            SHELL Components (8)
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SHELL_COMPONENTS.map(({ name, el }) => (
              <div
                key={name}
                className="relative p-4 border border-amber-500/20 rounded-lg bg-black/40"
              >
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] rounded bg-amber-500/20 text-amber-400">
                  SHELL
                </span>
                <div className="text-[10px] text-cyan-500/50 mb-2 font-mono">{name}</div>
                {el}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
