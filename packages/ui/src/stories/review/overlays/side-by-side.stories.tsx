// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ActivityFeed } from "../../../components/catalog/activity-feed";
import { StatsGrid } from "../../../components/catalog/stats-grid";
import { DataTable } from "../../../components/catalog/data-table";
import { AgentAvatar } from "../../../components/catalog/agent-avatar";
import { MetricChart } from "../../../components/catalog/metric-chart";
import { AlertBanner } from "../../../components/catalog/alert-banner";
import { TokenStream } from "../../../components/catalog/token-stream";
import { CalendarView } from "../../../components/catalog/calendar-view";
import { HeatmapGrid } from "../../../components/catalog/heatmap-grid";
import { ProgressBar } from "../../../components/catalog/progress-bar";
import { MessageBubble } from "../../../components/catalog/message-bubble";
import { FileExplorer } from "../../../components/catalog/file-explorer";
import { JsonEditor } from "../../../components/catalog/json-editor";
import { TerminalView } from "../../../components/catalog/terminal-view";
import { Breadcrumbs } from "../../../components/catalog/breadcrumbs";
import { TabsContainer } from "../../../components/catalog/tabs-container";
import { Rating } from "../../../components/catalog/rating";
import { AudioPlayer } from "../../../components/catalog/audio-player";
import { WeatherCard } from "../../../components/catalog/weather-card";
import { WorldClock } from "../../../components/catalog/world-clock";

const meta: Meta = {
  title: "Review/Overlays/Side by Side",
};
export default meta;

type Story = StoryObj;

function Cell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-2 min-h-[120px]">
      <div className="text-[10px] text-cyan-500/50 font-mono">{name}</div>
      {children}
    </div>
  );
}

const metricData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i}:00`,
  value: 40 + Math.sin(i * 0.8) * 30 + Math.random() * 10,
}));

export const TwentyComponents: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Side-by-Side Comparison
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            20 diverse components in a 2-column grid for visual review
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Cell name="ActivityFeed">
            <ActivityFeed
              activities={[
                { id: "1", user: "agent-alpha", action: "deployed", target: "api-v2", timestamp: "2m ago", type: "deploy" },
                { id: "2", user: "monitor", action: "triggered", target: "cpu-alert", timestamp: "5m ago", type: "alert" },
                { id: "3", user: "agent-beta", action: "completed", target: "task-142", timestamp: "8m ago", type: "success" },
                { id: "4", user: "system", action: "error in", target: "worker-3", timestamp: "12m ago", type: "error" },
              ]}
            />
          </Cell>

          <Cell name="StatsGrid">
            <StatsGrid
              columns={2}
              stats={[
                { label: "Agents", value: "12", change: 8 },
                { label: "Tasks", value: "347", change: -2 },
                { label: "Uptime", value: "99.7%" },
                { label: "Latency", value: "42ms", change: -15 },
              ]}
            />
          </Cell>

          <Cell name="DataTable">
            <DataTable
              columns={[
                { key: "name", header: "Agent" },
                { key: "status", header: "Status" },
                { key: "tasks", header: "Tasks" },
              ]}
              data={[
                { name: "Alpha", status: "online", tasks: 42 },
                { name: "Beta", status: "idle", tasks: 18 },
                { name: "Gamma", status: "offline", tasks: 0 },
              ]}
            />
          </Cell>

          <Cell name="AgentAvatar">
            <div className="flex gap-3 items-center">
              <AgentAvatar name="Agent Alpha" size="lg" status="speaking" />
              <AgentAvatar name="Beta" size="md" status="thinking" />
              <AgentAvatar name="Gamma" size="sm" status="idle" />
              <AgentAvatar name="Delta" size="sm" status="offline" />
            </div>
          </Cell>

          <Cell name="MetricChart">
            <MetricChart title="CPU Usage" data={metricData} color="#00e5ff" height={100} />
          </Cell>

          <Cell name="AlertBanner">
            <div className="space-y-2">
              <AlertBanner type="error" message="Worker-3 unresponsive for 30s" title="Critical" />
              <AlertBanner type="warning" message="Memory usage at 85%" />
              <AlertBanner type="info" message="New agent version available" />
            </div>
          </Cell>

          <Cell name="TokenStream">
            <TokenStream
              tokens={["The", " agent", " successfully", " completed", " the", " analysis", " task", "."]}
              isStreaming={false}
            />
          </Cell>

          <Cell name="CalendarView">
            <CalendarView
              events={[
                { id: "1", title: "Deploy", date: new Date().toISOString(), color: "#00e5ff" },
                { id: "2", title: "Review", date: new Date(Date.now() + 86400000).toISOString(), color: "#ff2a6d" },
              ]}
            />
          </Cell>

          <Cell name="HeatmapGrid">
            <HeatmapGrid
              data={[
                [1, 5, 3, 8, 2, 6, 4],
                [3, 7, 1, 4, 9, 2, 5],
                [6, 2, 8, 3, 1, 7, 4],
                [4, 8, 5, 9, 3, 1, 6],
              ]}
              cellSize={20}
              labels={{ rows: ["Mon", "Tue", "Wed", "Thu"], cols: ["0", "4", "8", "12", "16", "20", "24"] }}
            />
          </Cell>

          <Cell name="ProgressBar">
            <div className="space-y-3">
              <ProgressBar value={75} label="Build" variant="default" />
              <ProgressBar value={100} label="Tests" variant="success" />
              <ProgressBar value={45} label="Deploy" variant="warning" />
              <ProgressBar value={15} label="Memory" variant="error" />
            </div>
          </Cell>

          <Cell name="MessageBubble">
            <div className="space-y-2">
              <MessageBubble sender="Agent Alpha" content="Task analysis complete. Found 3 issues." />
              <MessageBubble sender="You" content="Can you fix the critical one first?" isOwn />
            </div>
          </Cell>

          <Cell name="FileExplorer">
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
                { name: "package.json", path: "/package.json", isDirectory: false },
              ]}
              workspacePath="/project"
            />
          </Cell>

          <Cell name="JsonEditor">
            <JsonEditor
              value={{ name: "lev-agent", version: "2.1.0", status: "active", tasks: 42 }}
              readOnly
            />
          </Cell>

          <Cell name="TerminalView">
            <TerminalView
              lines={[
                { text: "lev start --agent alpha", type: "input" },
                { text: "Agent alpha starting...", type: "system" },
                { text: "Listening on port 3001", type: "output" },
                { text: "Error: Redis connection refused", type: "error" },
                { text: "Retrying in 5s...", type: "output" },
              ]}
              prompt="lev>"
            />
          </Cell>

          <Cell name="Breadcrumbs">
            <Breadcrumbs path={["Home", "Agents", "Alpha", "Tasks", "Analysis"]} />
          </Cell>

          <Cell name="TabsContainer">
            <TabsContainer
              tabs={[
                { id: "overview", label: "Overview", content: <div className="text-xs text-gray-400 p-2">Agent overview panel</div> },
                { id: "logs", label: "Logs", content: <div className="text-xs text-gray-400 p-2">Log stream output</div> },
                { id: "metrics", label: "Metrics", content: <div className="text-xs text-gray-400 p-2">Performance metrics</div> },
              ]}
            />
          </Cell>

          <Cell name="Rating">
            <div className="space-y-2">
              <Rating value={4} max={5} readOnly />
              <Rating value={2} max={5} readOnly />
            </div>
          </Cell>

          <Cell name="AudioPlayer">
            <AudioPlayer src="" title="Agent Voice Log #42" duration="2:34" />
          </Cell>

          <Cell name="WeatherCard">
            <WeatherCard temperature={22} condition="sunny" location="San Francisco" unit="C" />
          </Cell>

          <Cell name="WorldClock">
            <WorldClock
              timezones={[
                { zone: "America/New_York", label: "New York" },
                { zone: "Europe/London", label: "London" },
                { zone: "Asia/Tokyo", label: "Tokyo" },
              ]}
            />
          </Cell>
        </div>
      </div>
    </div>
  ),
};
