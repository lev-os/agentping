import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StatsGrid } from "../../components/migrations/stats-grid";
import { ActivityFeed } from "../../components/migrations/activity-feed";
import { AlertBanner } from "../../components/migrations/alert-banner";
import { SystemHealthGauge } from "../../components/migrations/system-health-gauge";
import { HeatmapGrid } from "../../components/migrations/heatmap-grid";
import { NetworkTopology } from "../../components/migrations/network-topology";
import { MetricChart } from "../../components/migrations/metric-chart";
import { ProcessTable } from "../../components/migrations/process-table";
import { StatusIndicator } from "../../components/migrations/status-indicator";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const stats = [
  { label: "Requests / sec", value: "12.4k", change: 8.2 },
  { label: "Error rate", value: "0.03%", change: -12.1 },
  { label: "P99 latency", value: "142ms", change: 3.4 },
  { label: "Active nodes", value: 47, change: 0 },
];

const activities = [
  { id: "a1", user: "deployer-9", action: "rolled out", target: "api-gateway v3.8.1", timestamp: "14:32:08 UTC", type: "deploy" as const },
  { id: "a2", user: "watchdog", action: "triggered alert on", target: "node-03 memory", timestamp: "14:31:55 UTC", type: "alert" as const },
  { id: "a3", user: "cron/reaper", action: "garbage-collected", target: "48 stale sessions", timestamp: "14:30:00 UTC", type: "success" as const },
  { id: "a4", user: "auth-svc", action: "rate-limited", target: "185.22.x.x (brute-force)", timestamp: "14:29:41 UTC", type: "error" as const },
  { id: "a5", user: "indexer", action: "reindexed", target: "knowledge-base v2", timestamp: "14:28:12 UTC", type: "info" as const },
  { id: "a6", user: "deployer-9", action: "scaled up", target: "worker-pool to 12 replicas", timestamp: "14:27:33 UTC", type: "deploy" as const },
  { id: "a7", user: "healthcheck", action: "recovered", target: "redis-cluster-east", timestamp: "14:26:01 UTC", type: "success" as const },
  { id: "a8", user: "cert-manager", action: "renewed cert for", target: "*.agentping.dev", timestamp: "14:25:00 UTC", type: "info" as const },
];

const healthMetrics = [
  { label: "CPU", value: 62, max: 100, unit: "%", status: "ok" as const },
  { label: "Memory", value: 78, max: 100, unit: "%", status: "warning" as const },
  { label: "Disk I/O", value: 34, max: 100, unit: "%", status: "ok" as const },
  { label: "Network", value: 91, max: 100, unit: "%", status: "critical" as const },
  { label: "GPU", value: 45, max: 100, unit: "%", status: "ok" as const },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
);
const heatmapLabels = {
  rows: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  cols: Array.from({ length: 24 }, (_, i) => `${i}`),
};

const topoNodes = [
  { id: "lb", label: "LB", type: "server" as const, status: "healthy" as const, x: 300, y: 40 },
  { id: "api1", label: "API-1", type: "service" as const, status: "healthy" as const, x: 150, y: 130 },
  { id: "api2", label: "API-2", type: "service" as const, status: "healthy" as const, x: 450, y: 130 },
  { id: "worker", label: "Workers", type: "service" as const, status: "warning" as const, x: 300, y: 220 },
  { id: "pg", label: "Postgres", type: "db" as const, status: "healthy" as const, x: 150, y: 310 },
  { id: "redis", label: "Redis", type: "db" as const, status: "healthy" as const, x: 450, y: 310 },
];
const topoLinks = [
  { source: "lb", target: "api1", traffic: 6200 },
  { source: "lb", target: "api2", traffic: 6100 },
  { source: "api1", target: "worker", traffic: 3100 },
  { source: "api2", target: "worker", traffic: 3000 },
  { source: "worker", target: "pg", traffic: 2400 },
  { source: "worker", target: "redis", traffic: 4800 },
];

const rpsData = Array.from({ length: 30 }, (_, i) => ({
  time: `14:${String(i).padStart(2, "0")}`,
  value: 10000 + Math.floor(Math.random() * 5000),
}));

const errorData = Array.from({ length: 30 }, (_, i) => ({
  time: `14:${String(i).padStart(2, "0")}`,
  value: Math.floor(Math.random() * 20),
}));

const processes = [
  { pid: 1, name: "api-gateway", cpu: 34.2, memory: 18.7, status: "running" as const, user: "app" },
  { pid: 14, name: "worker-pool", cpu: 72.8, memory: 42.1, status: "running" as const, user: "app" },
  { pid: 22, name: "indexer", cpu: 12.4, memory: 8.3, status: "running" as const, user: "app" },
  { pid: 31, name: "redis-proxy", cpu: 5.1, memory: 3.2, status: "running" as const, user: "redis" },
  { pid: 38, name: "pg-bouncer", cpu: 8.9, memory: 6.1, status: "running" as const, user: "postgres" },
  { pid: 44, name: "log-shipper", cpu: 2.3, memory: 1.8, status: "sleeping" as const, user: "app" },
  { pid: 55, name: "cron-reaper", cpu: 0.0, memory: 0.4, status: "sleeping" as const, user: "root" },
  { pid: 99, name: "defunct-agent", cpu: 0.0, memory: 0.0, status: "zombie" as const, user: "app" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function OperationsCommandDashboard() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Top bar */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/40 text-xs">[OPS]</span>
          <h1 className="text-lg text-cyan-400 tracking-wide">Operations Command Center</h1>
        </div>
        <div className="flex gap-4">
          <StatusIndicator status="online" label="API" />
          <StatusIndicator status="online" label="Redis" />
          <StatusIndicator status="busy" label="Workers" />
          <StatusIndicator status="away" label="DB-Replica" />
        </div>
      </div>

      {/* Alert */}
      <div className="px-6 pt-4">
        <AlertBanner
          type="warning"
          title="Memory pressure detected"
          message="node-03 memory usage at 91% — consider scaling worker-pool or triggering GC sweep"
        />
      </div>

      {/* Stats row */}
      <div className="px-6 pt-4">
        <StatsGrid stats={stats} columns={4} />
      </div>

      {/* Main grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left panel — Activity feed */}
        <div className="col-span-3 space-y-4">
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg">
            <div className="px-4 py-2 border-b border-cyan-500/10">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">LIVE ACTIVITY</span>
            </div>
            <ActivityFeed activities={activities} maxHeight={480} />
          </div>
        </div>

        {/* Center — Heatmap + Charts */}
        <div className="col-span-6 space-y-6">
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
              REQUEST HEATMAP (7d x 24h)
            </div>
            <HeatmapGrid data={heatmapData} labels={heatmapLabels} cellSize={20} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricChart title="Requests / sec" data={rpsData} color="#06b6d4" height={120} />
            <MetricChart title="Errors / min" data={errorData} color="#ef4444" height={120} />
          </div>

          <ProcessTable processes={processes} />
        </div>

        {/* Right panel — Health + Topology */}
        <div className="col-span-3 space-y-4">
          <SystemHealthGauge metrics={healthMetrics} title="CLUSTER HEALTH" />
          <NetworkTopology
            nodes={topoNodes}
            links={topoLinks}
            width={400}
            height={360}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function OperationsEmpty() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg text-cyan-400 tracking-wide">Operations Command Center</h1>
        <div className="flex gap-4">
          <StatusIndicator status="offline" label="API" />
          <StatusIndicator status="offline" label="Redis" />
        </div>
      </div>
      <div className="px-6 pt-4">
        <AlertBanner type="info" message="No telemetry data available. Connect your infrastructure to begin monitoring." />
      </div>
      <div className="px-6 pt-4">
        <StatsGrid stats={[]} columns={4} />
      </div>
      <div className="p-6">
        <SystemHealthGauge metrics={[]} title="CLUSTER HEALTH" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story config
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Pages/Operations Command Dashboard",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <OperationsCommandDashboard /> };
export const Empty: Story = { render: () => <OperationsEmpty /> };
