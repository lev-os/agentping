// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LandingPage } from "../../../components/migrations/landing-page";
import { HistoryView } from "../../../components/migrations/history-view";
import { WelcomeScreen } from "../../../components/migrations/welcome-screen";
import { Navigator } from "../../../components/migrations/navigator";
import { NavigatorWithDashboards } from "../../../components/migrations/navigator-with-dashboards";
import { ChatPanel } from "../../../components/migrations/chat-panel";
import { SharedComponents } from "../../../components/migrations/shared-components";
import { EnrichmentPanel } from "../../../components/migrations/enrichment-panel";
import { FileExplorer } from "../../../components/migrations/file-explorer";
import { CanvasRenderer } from "../../../components/migrations/canvas-renderer";
import { PolymorphPlayground } from "../../../components/migrations/polymorph-playground";
import { CalendarView } from "../../../components/migrations/calendar-view";
import { DmLogViewer } from "../../../components/migrations/dm-log-viewer";
import { DmUptimeChart } from "../../../components/migrations/dm-uptime-chart";
import { DmRestartHistogram } from "../../../components/migrations/dm-restart-histogram";
import { GlobeWireframe } from "../../../components/migrations/globe-wireframe";
import { ParticleStream } from "../../../components/migrations/particle-stream";
import { MindMap } from "../../../components/migrations/mind-map";
import { DependencyGraph } from "../../../components/migrations/dependency-graph";
import { SettingsModal } from "../../../components/migrations/settings-modal";

const meta: Meta = {
  title: "Review/Overlays/Needs Review",
};
export default meta;

type Story = StoryObj;

interface ReviewCardProps {
  name: string;
  note: string;
  children: React.ReactNode;
}

function ReviewCard({ name, note, children }: ReviewCardProps) {
  return (
    <div className="p-4 border border-purple-500/20 rounded-lg bg-black/40">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-cyan-500/50 font-mono">{name}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
          NEEDS REVIEW
        </span>
      </div>
      <div className="text-[9px] text-purple-400/60 mb-3 font-mono">{note}</div>
      {children}
    </div>
  );
}

export const AllNeedsReview: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-purple-500/20 pb-4">
          <h1 className="text-lg font-mono text-purple-400 uppercase tracking-wider">
            Needs Review
          </h1>
          <p className="text-xs text-purple-400/40 mt-1">
            20 components flagged for complex runtime coupling or manual QA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReviewCard
            name="LandingPage"
            note="Complex page component with hardcoded agent data. Shell wrapper only."
          >
            <div className="max-h-[200px] overflow-hidden rounded border border-purple-500/10">
              <LandingPage />
            </div>
          </ReviewCard>

          <ReviewCard
            name="HistoryView"
            note="Depends on runtime ping history data and onSelectPing handler"
          >
            <HistoryView
              entries={[
                { id: "1", title: "Deploy v2.0", timestamp: "2h ago", status: "completed" },
                { id: "2", title: "Run analysis", timestamp: "4h ago", status: "failed" },
                { id: "3", title: "Agent restart", timestamp: "1d ago", status: "completed" },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="WelcomeScreen"
            note="Runtime coupled to onStartSession handler and bridge state"
          >
            <WelcomeScreen onStartSession={() => {}} />
          </ReviewCard>

          <ReviewCard
            name="Navigator"
            note="Thin wrapper delegating to NavigatorWithDashboards"
          >
            <Navigator
              dashboards={[
                { id: "1", name: "API Server", url: "http://localhost:4001", port: 4001, status: "online" },
                { id: "2", name: "Worker", url: "http://localhost:5001", port: 5001, status: "failed" },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="NavigatorWithDashboards"
            note="Runtime coupled to dashboard-manager API for live status"
          >
            <NavigatorWithDashboards
              dashboards={[
                { id: "1", name: "Web App", url: "http://localhost:3001", port: 3001, status: "online" },
                { id: "2", name: "API", url: "http://localhost:4001", port: 4001, status: "online" },
                { id: "3", name: "Worker", url: "http://localhost:5001", port: 5001, status: "failed" },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="ChatPanel"
            note="Runtime coupled: forwardRef imperative handle, bridge state, session management"
          >
            <ChatPanel
              messages={[
                { id: "1", role: "user", content: "Analyze the codebase" },
                { id: "2", role: "assistant", content: "I found 3 potential issues in the event handler..." },
              ]}
              isConnected={true}
              workspacePath="/home/user/project"
            />
          </ReviewCard>

          <ReviewCard
            name="SharedComponents"
            note="Barrel re-export module, not a visual component"
          >
            <SharedComponents />
          </ReviewCard>

          <ReviewCard
            name="EnrichmentPanel"
            note="Container shell, needs runtime enrichment data pipeline"
          >
            <EnrichmentPanel />
          </ReviewCard>

          <ReviewCard
            name="FileExplorer"
            note="Runtime coupled: window.fileSystem, window.claudeCode"
          >
            <FileExplorer
              files={[
                {
                  name: "src",
                  path: "/src",
                  isDirectory: true,
                  children: [
                    { name: "index.ts", path: "/src/index.ts", isDirectory: false },
                    { name: "config.ts", path: "/src/config.ts", isDirectory: false },
                  ],
                },
              ]}
              workspacePath="/project"
            />
          </ReviewCard>

          <ReviewCard
            name="CanvasRenderer"
            note="Heavy runtime coupling to Sofia widget engine and polymorph templates"
          >
            <CanvasRenderer
              payload={{ type: "canvas_interaction", action: "selection" }}
              onRespond={() => {}}
            />
          </ReviewCard>

          <ReviewCard
            name="PolymorphPlayground"
            note="Heavy runtime coupling to polymorph engine (templates, themes, getThemeTokens)"
          >
            <PolymorphPlayground />
          </ReviewCard>

          <ReviewCard
            name="CalendarView"
            note="Complex calendar logic, verify date handling edge cases"
          >
            <CalendarView
              events={[
                { id: "1", title: "Deploy", date: new Date().toISOString(), color: "#00e5ff" },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="DmLogViewer"
            note="Original uses useWebSocket hook for live log streaming; migration is static"
          >
            <DmLogViewer
              dashboardId="app"
              logs={[
                { dashboardId: "app", line: "[INFO] Connected", stream: "stdout", timestamp: new Date().toISOString() },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="DmUptimeChart"
            note="Original uses recharts AreaChart; migration uses CSS bar visualization"
          >
            <DmUptimeChart uptimeMs={43200000} />
          </ReviewCard>

          <ReviewCard
            name="DmRestartHistogram"
            note="Original uses recharts BarChart; migration uses CSS bar visualization"
          >
            <DmRestartHistogram restarts={12} />
          </ReviewCard>

          <ReviewCard
            name="GlobeWireframe"
            note="Complex SVG/CSS animation globe, simplified from WebGL original"
          >
            <GlobeWireframe size={120} />
          </ReviewCard>

          <ReviewCard
            name="ParticleStream"
            note="CSS-only particle animation (simplified from canvas-based original)"
          >
            <div className="h-[100px] relative overflow-hidden rounded">
              <ParticleStream count={15} />
            </div>
          </ReviewCard>

          <ReviewCard
            name="MindMap"
            note="Simplified tree view, original uses SVG rendering"
          >
            <MindMap
              data={{
                id: "root",
                label: "Root",
                children: [
                  { id: "a", label: "Branch A" },
                  { id: "b", label: "Branch B", children: [{ id: "b1", label: "Leaf" }] },
                ],
              }}
            />
          </ReviewCard>

          <ReviewCard
            name="DependencyGraph"
            note="Simplified list layout, original uses SVG graph rendering"
          >
            <DependencyGraph
              nodes={[
                { id: "core", label: "Core", deps: [], status: "ok" },
                { id: "config", label: "Config", deps: ["core"], status: "warning" },
              ]}
            />
          </ReviewCard>

          <ReviewCard
            name="SettingsModal"
            note="Runtime coupled to electron settings bridge and persistent config"
          >
            <SettingsModal
              isOpen={true}
              onClose={() => {}}
              settings={{ model: "claude-opus-4-6", theme: "dark" }}
              onSave={() => {}}
            />
          </ReviewCard>
        </div>
      </div>
    </div>
  ),
};
