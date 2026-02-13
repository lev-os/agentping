import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DataTable } from "../../../components/migrations/data-table";
import { LogStream } from "../../../components/migrations/log-stream";
import { LogHistogram } from "../../../components/migrations/log-histogram";
import { AuditLogViewer } from "../../../components/migrations/audit-log-viewer";
import { SystemHealthGauge } from "../../../components/migrations/system-health-gauge";
import { MemoryUsageChart } from "../../../components/migrations/memory-usage-chart";
import { LatencyHistogram } from "../../../components/migrations/latency-histogram";
import { NetworkTopology } from "../../../components/migrations/network-topology";
import { ErrorCluster } from "../../../components/migrations/error-cluster";
import { ActiveSessions } from "../../../components/migrations/active-sessions";
import { HexInspector } from "../../../components/migrations/hex-inspector";
import { TerminalView } from "../../../components/migrations/terminal-view";
import {
  LogViewerStudioRaw,
  LogViewerWebUiRaw,
  LogViewerCandidate,
} from "../../../components/migrations";
import { TerminalConsole } from "../../../components/migrations/terminal-console";
import { ProcessTable } from "../../../components/migrations/process-table";
import { DockerStats } from "../../../components/migrations/docker-stats";
import { SqlResultTable } from "../../../components/migrations/sql-result-table";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const tableData = [
  { id: "1", name: "agent-alpha", status: "online", cpu: "12%", region: "us-east-1" },
  { id: "2", name: "agent-beta", status: "offline", cpu: "0%", region: "eu-west-1" },
  { id: "3", name: "agent-gamma", status: "online", cpu: "45%", region: "ap-south-1" },
  { id: "4", name: "agent-delta", status: "degraded", cpu: "78%", region: "us-west-2" },
  { id: "5", name: "agent-epsilon", status: "online", cpu: "23%", region: "eu-central-1" },
];

const logEntries = [
  { id: "1", timestamp: "12:34:56", level: "info" as const, message: "Checkpoint saved to persistent store" },
  { id: "2", timestamp: "12:34:57", level: "debug" as const, message: "Heartbeat received from agent-beta" },
  { id: "3", timestamp: "12:34:58", level: "warn" as const, message: "Memory threshold exceeded on node-3" },
  { id: "4", timestamp: "12:34:59", level: "error" as const, message: "Connection refused: agent-delta unreachable" },
  { id: "5", timestamp: "12:35:00", level: "info" as const, message: "Auto-scaling triggered for cluster-east" },
  { id: "6", timestamp: "12:35:01", level: "info" as const, message: "Deployment v2.4.1 rollout started" },
];

const logBuckets = [
  { time: "00:00", count: 12, level: "info" as const },
  { time: "01:00", count: 8, level: "info" as const },
  { time: "02:00", count: 45, level: "warn" as const },
  { time: "03:00", count: 23, level: "info" as const },
  { time: "04:00", count: 67, level: "error" as const },
  { time: "05:00", count: 34, level: "info" as const },
  { time: "06:00", count: 15, level: "info" as const },
  { time: "07:00", count: 52, level: "warn" as const },
  { time: "08:00", count: 89, level: "error" as const },
  { time: "09:00", count: 41, level: "info" as const },
];

const auditLogs = [
  { id: "1", timestamp: "2026-02-13 08:00", actor: "admin@kingly.ai", action: "deploy", resource: "production/v2.4.1" },
  { id: "2", timestamp: "2026-02-13 08:15", actor: "ci-bot", action: "approve", resource: "PR #1847" },
  { id: "3", timestamp: "2026-02-13 09:30", actor: "agent-alpha", action: "scale-up", resource: "cluster-east" },
  { id: "4", timestamp: "2026-02-13 10:00", actor: "admin@kingly.ai", action: "revoke", resource: "token-xyz-expired" },
];

const healthMetrics = [
  { label: "CPU", value: 67, max: 100, unit: "%", status: "ok" as const },
  { label: "Memory", value: 82, max: 100, unit: "%", status: "warning" as const },
  { label: "Disk I/O", value: 34, max: 100, unit: "%", status: "ok" as const },
  { label: "Network", value: 95, max: 100, unit: "%", status: "critical" as const },
];

const memoryData = [
  { time: "00:00", used: 2048, total: 4096 },
  { time: "04:00", used: 2560, total: 4096 },
  { time: "08:00", used: 3200, total: 4096 },
  { time: "12:00", used: 3600, total: 4096 },
  { time: "16:00", used: 3900, total: 4096 },
  { time: "20:00", used: 3100, total: 4096 },
];

const latencyBuckets = [
  { label: "<10ms", count: 450 },
  { label: "10-50ms", count: 320 },
  { label: "50-100ms", count: 180 },
  { label: "100-500ms", count: 45 },
  { label: "500ms-1s", count: 12 },
  { label: ">1s", count: 3 },
];

const topoNodes = [
  { id: "gw", label: "Gateway", type: "service" as const, status: "healthy" as const, x: 300, y: 40 },
  { id: "api", label: "API Server", type: "service" as const, status: "healthy" as const, x: 150, y: 140 },
  { id: "ws", label: "WebSocket", type: "service" as const, status: "warning" as const, x: 450, y: 140 },
  { id: "db", label: "PostgreSQL", type: "db" as const, status: "healthy" as const, x: 100, y: 260 },
  { id: "redis", label: "Redis", type: "db" as const, status: "healthy" as const, x: 300, y: 260 },
  { id: "client", label: "Client", type: "client" as const, status: "healthy" as const, x: 500, y: 260 },
];

const topoLinks = [
  { source: "gw", target: "api", traffic: 1200 },
  { source: "gw", target: "ws", traffic: 800 },
  { source: "api", target: "db", traffic: 600 },
  { source: "api", target: "redis", traffic: 400 },
  { source: "ws", target: "redis", traffic: 300 },
  { source: "ws", target: "client", traffic: 800 },
];

const errorGroups = [
  { id: "1", message: "ECONNREFUSED 10.0.0.5:5432 - database connection pool exhausted", count: 47, lastSeen: "2 min ago" },
  { id: "2", message: "TimeoutError: request exceeded 30s deadline on /api/v2/agents", count: 12, lastSeen: "5 min ago" },
  { id: "3", message: "ENOMEM: unable to allocate 256MB for embedding batch", count: 3, lastSeen: "18 min ago" },
];

const sessions = [
  { id: "1", user: "admin@kingly.ai", ip: "192.168.1.100", duration: "2h 15m", device: "Chrome / macOS", status: "active" as const },
  { id: "2", user: "agent-alpha", ip: "10.0.0.12", duration: "45m", device: "API Client", status: "active" as const },
  { id: "3", user: "dev@kingly.ai", ip: "192.168.1.105", duration: "1h 30m", device: "Firefox / Linux", status: "idle" as const },
];

const hexData = [
  0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f,
  0x72, 0x6c, 0x64, 0x00, 0x4c, 0x65, 0x76, 0x69,
  0x61, 0x74, 0x68, 0x61, 0x6e, 0x20, 0x52, 0x75,
  0x6e, 0x74, 0x69, 0x6d, 0x65, 0x00, 0xff, 0xfe,
];

const terminalLines = [
  { text: "lev status --all", type: "input" as const },
  { text: "Cluster: healthy (5/5 nodes online)", type: "output" as const },
  { text: "Agent pool: 3 active, 1 idle, 1 offline", type: "output" as const },
  { text: "lev deploy production v2.4.1", type: "input" as const },
  { text: "Rolling update started...", type: "system" as const },
  { text: "Warning: node-3 memory > 90%", type: "error" as const },
];

const conflictLogEntries = [
  { id: "1", timestamp: "08:00:01", level: "info" as const, message: "Service started on port 8080", source: "gateway" },
  { id: "2", timestamp: "08:00:05", level: "debug" as const, message: "Health check passed", source: "api" },
  { id: "3", timestamp: "08:00:12", level: "warn" as const, message: "Slow query detected (2.3s)", source: "db" },
  { id: "4", timestamp: "08:00:18", level: "error" as const, message: "Connection pool exhausted", source: "redis" },
];

const consoleLines = [
  { type: "system" as const, content: "Lev Runtime v2.4.1 initialized" },
  { type: "input" as const, content: "lev agent list" },
  { type: "output" as const, content: "agent-alpha  online   cpu:12%  mem:2.1GB" },
  { type: "output" as const, content: "agent-beta   offline  cpu:0%   mem:0GB" },
  { type: "input" as const, content: "lev agent restart beta" },
  { type: "error" as const, content: "Error: agent-beta is unreachable (ETIMEDOUT)" },
];

const processes = [
  { pid: 1, name: "lev-daemon", cpu: 2.3, memory: 1.8, status: "running" as const, user: "root" },
  { pid: 245, name: "agent-alpha", cpu: 12.5, memory: 4.2, status: "running" as const, user: "lev" },
  { pid: 246, name: "agent-beta", cpu: 0.0, memory: 0.1, status: "stopped" as const, user: "lev" },
  { pid: 389, name: "embedder", cpu: 45.2, memory: 8.7, status: "running" as const, user: "lev" },
  { pid: 412, name: "redis-bridge", cpu: 0.8, memory: 0.5, status: "sleeping" as const, user: "lev" },
];

const containers = [
  { id: "c1", name: "lev-api", status: "running" as const, cpu: 15.2, memory: 512, memoryLimit: "1GB" },
  { id: "c2", name: "lev-db", status: "running" as const, cpu: 8.4, memory: 1024, memoryLimit: "2GB" },
  { id: "c3", name: "lev-redis", status: "running" as const, cpu: 2.1, memory: 128, memoryLimit: "512MB" },
  { id: "c4", name: "lev-worker", status: "paused" as const, cpu: 0.0, memory: 256, memoryLimit: "1GB" },
  { id: "c5", name: "lev-metrics", status: "stopped" as const, cpu: 0.0, memory: 0, memoryLimit: "256MB" },
];

const sqlColumns = ["id", "name", "status", "last_seen", "region"];
const sqlRows = [
  ["1", "agent-alpha", "ONLINE", "2026-02-13 12:34", "us-east-1"],
  ["2", "agent-beta", "OFFLINE", "2026-02-13 11:00", "eu-west-1"],
  ["3", "agent-gamma", "ONLINE", "2026-02-13 12:35", "ap-south-1"],
];

/* ------------------------------------------------------------------ */
/* Card wrapper                                                        */
/* ------------------------------------------------------------------ */

function Card({ title, children, span = 1 }: { title: string; children: React.ReactNode; span?: number }) {
  return (
    <div
      className="p-4 border border-cyan-500/20 rounded-lg bg-black/40"
      style={span > 1 ? { gridColumn: `span ${span}` } : undefined}
    >
      <div className="text-[10px] text-cyan-400 mb-3 uppercase tracking-wider font-mono">{title}</div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

function DataLogsSystemReview() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cyan-100 font-mono">Data, Logs & System</h1>
          <p className="text-sm text-cyan-500/60 mt-1 font-mono">18 components -- data tables, log viewers, system monitoring, terminals</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card title="DataTable" span={2}>
            <DataTable
              columns={[
                { key: "name", header: "Agent Name", sortable: true },
                { key: "status", header: "Status", sortable: true },
                { key: "cpu", header: "CPU" },
                { key: "region", header: "Region", sortable: true },
              ]}
              data={tableData}
              keyField="id"
            />
          </Card>

          <Card title="LogStream">
            <LogStream entries={logEntries} autoScroll={false} />
          </Card>

          <Card title="LogHistogram">
            <LogHistogram data={logBuckets} height={160} />
          </Card>

          <Card title="AuditLogViewer" span={2}>
            <AuditLogViewer logs={auditLogs} />
          </Card>

          <Card title="SystemHealthGauge">
            <SystemHealthGauge metrics={healthMetrics} title="CLUSTER HEALTH" />
          </Card>

          <Card title="MemoryUsageChart">
            <MemoryUsageChart data={memoryData} height={160} />
          </Card>

          <Card title="LatencyHistogram">
            <LatencyHistogram data={latencyBuckets} height={160} />
          </Card>

          <Card title="NetworkTopology">
            <NetworkTopology nodes={topoNodes} links={topoLinks} width={500} height={300} />
          </Card>

          <Card title="ErrorCluster" span={2}>
            <ErrorCluster errors={errorGroups} />
          </Card>

          <Card title="ActiveSessions" span={2}>
            <ActiveSessions sessions={sessions} />
          </Card>

          <Card title="HexInspector">
            <HexInspector data={hexData} />
          </Card>

          <Card title="TerminalView">
            <TerminalView lines={terminalLines} />
          </Card>

          <Card title="LogViewerStudioRaw (Conflict)">
            <LogViewerStudioRaw entries={conflictLogEntries} />
          </Card>

          <Card title="LogViewerWebUiRaw (Conflict)">
            <LogViewerWebUiRaw entries={conflictLogEntries} />
          </Card>

          <Card title="LogViewerCandidate (Conflict)" span={2}>
            <LogViewerCandidate />
          </Card>

          <Card title="TerminalConsole">
            <TerminalConsole lines={consoleLines} />
          </Card>

          <Card title="ProcessTable">
            <ProcessTable processes={processes} />
          </Card>

          <Card title="DockerStats" span={2}>
            <DockerStats containers={containers} />
          </Card>

          <Card title="SqlResultTable" span={2}>
            <SqlResultTable
              columns={sqlColumns}
              rows={sqlRows}
              query="SELECT id, name, status, last_seen, region FROM agents WHERE status != 'DELETED' ORDER BY name;"
              executionTime="0.023s"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Review/Domain/Data, Logs & System",
  component: DataLogsSystemReview,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
