import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { DmDashboardList } from "../../../components/catalog/dm-dashboard-list";
import { DmDashboardDetail } from "../../../components/catalog/dm-dashboard-detail";
import { DmAnalyticsPanel } from "../../../components/catalog/dm-analytics-panel";
import { DmCreateDashboardModal } from "../../../components/catalog/dm-create-dashboard-modal";
import { DmLogViewer } from "../../../components/catalog/dm-log-viewer";
import { DmRestartHistogram } from "../../../components/catalog/dm-restart-histogram";
import { DmStatusBadge } from "../../../components/catalog/dm-status-badge";
import { DmUptimeChart } from "../../../components/catalog/dm-uptime-chart";

const meta: Meta = {
  title: "Review/Domain/Dashboard Manager",
};
export default meta;

type Story = StoryObj;

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-3">
      <h3 className="text-xs text-cyan-500/60 uppercase tracking-wider font-mono">
        {title}
      </h3>
      {children}
    </div>
  );
}

const MOCK_DASHBOARDS = [
  {
    id: "web-app",
    config: { name: "Web Application", port_range: [3000, 3100] as [number, number] },
    status: {
      status: "online" as const,
      healthy: true,
      port: 3001,
      pid: 12345,
      restartAttempts: 0,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  },
  {
    id: "api-server",
    config: { name: "API Server", port_range: [4000, 4100] as [number, number] },
    status: {
      status: "online" as const,
      healthy: true,
      port: 4001,
      pid: 12346,
      restartAttempts: 2,
      startedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    id: "worker",
    config: { name: "Background Worker", port_range: [5000, 5100] as [number, number] },
    status: {
      status: "failed" as const,
      healthy: false,
      restartAttempts: 5,
    },
  },
  {
    id: "docs",
    config: { name: "Documentation Site", port_range: [6000, 6100] as [number, number] },
    status: {
      status: "stopped" as const,
      restartAttempts: 0,
    },
  },
];

const MOCK_DASHBOARD_DETAIL = {
  id: "web-app",
  config: {
    name: "Web Application",
    command: "npm run dev",
    cwd: "/home/user/projects/web-app",
    port_range: [3000, 3100] as [number, number],
    health_check: { type: "http", path: "/health", timeout_ms: 5000 },
  },
  status: {
    status: "online" as const,
    healthy: true,
    port: 3001,
    pid: 12345,
    restartAttempts: 0,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
  },
};

const MOCK_LOGS = [
  { dashboardId: "web-app", line: "[INFO] Server started on port 3001", stream: "stdout" as const, timestamp: new Date(Date.now() - 60000).toISOString() },
  { dashboardId: "web-app", line: "[INFO] Connected to database", stream: "stdout" as const, timestamp: new Date(Date.now() - 55000).toISOString() },
  { dashboardId: "web-app", line: "[WARN] Deprecated API endpoint called: /v1/users", stream: "stderr" as const, timestamp: new Date(Date.now() - 30000).toISOString() },
  { dashboardId: "web-app", line: "[INFO] Health check passed", stream: "stdout" as const, timestamp: new Date(Date.now() - 15000).toISOString() },
  { dashboardId: "web-app", line: "[ERROR] Connection timeout to redis:6379", stream: "stderr" as const, timestamp: new Date(Date.now() - 5000).toISOString() },
  { dashboardId: "web-app", line: "[INFO] Retrying redis connection...", stream: "stdout" as const, timestamp: new Date(Date.now() - 3000).toISOString() },
  { dashboardId: "web-app", line: "[INFO] Redis reconnected successfully", stream: "stdout" as const, timestamp: new Date(Date.now() - 1000).toISOString() },
];

export const AllComponents: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Dashboard Manager Components
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            8 DM components with realistic mock data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="DmDashboardList">
            <DmDashboardList
              dashboards={MOCK_DASHBOARDS}
              onRowClick={() => {}}
              onViewDetails={() => {}}
              onCreateNew={() => {}}
            />
          </Card>

          <Card title="DmDashboardDetail">
            <DmDashboardDetail
              dashboard={MOCK_DASHBOARD_DETAIL}
              metrics={{ uptime_ms: 3600000, restarts: 2 }}
              onBack={() => {}}
              onRestart={() => {}}
              onOpen={() => {}}
            />
          </Card>

          <Card title="DmAnalyticsPanel">
            <DmAnalyticsPanel
              dashboards={MOCK_DASHBOARDS.map((d) => ({
                status: {
                  status: d.status.status,
                  restartAttempts: d.status.restartAttempts,
                },
              }))}
            />
          </Card>

          <Card title="DmCreateDashboardModal">
            <DmCreateDashboardModal
              onClose={() => {}}
              onSubmit={async () => {}}
            />
          </Card>

          <Card title="DmLogViewer">
            <DmLogViewer dashboardId="web-app" logs={MOCK_LOGS} />
          </Card>

          <Card title="DmRestartHistogram">
            <DmRestartHistogram restarts={7} />
          </Card>

          <div className="space-y-4">
            <Card title="DmStatusBadge (all states)">
              <div className="flex flex-wrap gap-3">
                <DmStatusBadge status="online" healthy={true} />
                <DmStatusBadge status="online" healthy={false} />
                <DmStatusBadge status="starting" />
                <DmStatusBadge status="failed" />
                <DmStatusBadge status="stopped" />
              </div>
            </Card>
          </div>

          <Card title="DmUptimeChart">
            <DmUptimeChart uptimeMs={86400000} />
          </Card>
        </div>
      </div>
    </div>
  ),
};
