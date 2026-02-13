import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { LogStream } from "../../components/migrations/log-stream";
import { LogHistogram } from "../../components/migrations/log-histogram";
import { AuditLogViewer } from "../../components/migrations/audit-log-viewer";
import { TerminalView } from "../../components/migrations/terminal-view";
import { ErrorCluster } from "../../components/migrations/error-cluster";
import { LatencyHistogram } from "../../components/migrations/latency-histogram";
import { StackTraceProfiler } from "../../components/migrations/stack-trace-profiler";
import { DiagnosticPanel } from "../../components/migrations/diagnostic-panel";
import { StatusIndicator } from "../../components/migrations/status-indicator";
import { StatsGrid } from "../../components/migrations/stats-grid";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const logEntries = [
  { id: "l1", timestamp: "14:32:08.102", level: "info" as const, message: "Request processed: POST /api/v2/agents/create (200 OK, 42ms)" },
  { id: "l2", timestamp: "14:32:08.098", level: "debug" as const, message: "Auth token validated for user u-9f3a, scope: agent:write" },
  { id: "l3", timestamp: "14:32:07.911", level: "warn" as const, message: "Connection pool near capacity: 47/50 active connections (redis-east)" },
  { id: "l4", timestamp: "14:32:07.844", level: "error" as const, message: "Timeout: upstream service 'knowledge-index' did not respond within 5000ms" },
  { id: "l5", timestamp: "14:32:07.201", level: "info" as const, message: "Scheduled task 'session-reaper' completed: 12 expired sessions cleaned" },
  { id: "l6", timestamp: "14:32:06.987", level: "info" as const, message: "WebSocket connection established: agent agt-7f3a on node worker-06" },
  { id: "l7", timestamp: "14:32:06.543", level: "error" as const, message: "ECONNREFUSED: Cannot connect to postgres-replica-02:5432" },
  { id: "l8", timestamp: "14:32:06.102", level: "debug" as const, message: "Cache hit ratio: 94.2% (last 60s window)" },
  { id: "l9", timestamp: "14:32:05.881", level: "warn" as const, message: "Memory usage warning: worker-03 at 87% heap utilization" },
  { id: "l10", timestamp: "14:32:05.440", level: "info" as const, message: "Deployment canary: v3.8.1 serving 10% of traffic, 0 errors" },
  { id: "l11", timestamp: "14:32:04.992", level: "info" as const, message: "TLS certificate renewed for *.agentping.dev (expires 2026-05-13)" },
  { id: "l12", timestamp: "14:32:04.221", level: "error" as const, message: "Rate limit exceeded: 185.22.134.x sent 142 requests in 10s (limit: 100)" },
];

const logHistogramData = Array.from({ length: 30 }, (_, i) => ({
  time: `14:${String(i).padStart(2, "0")}`,
  count: Math.floor(Math.random() * 200) + 20,
  level: (["info", "info", "info", "warn", "error"] as const)[Math.floor(Math.random() * 5)],
}));

const auditLogs = [
  { id: "au1", timestamp: "14:32:00", actor: "admin@agentping.dev", action: "Updated", resource: "RBAC policy: agent-deploy" },
  { id: "au2", timestamp: "14:28:12", actor: "ci-bot", action: "Deployed", resource: "api-gateway v3.8.1" },
  { id: "au3", timestamp: "14:22:45", actor: "ops-lead", action: "Scaled", resource: "worker-pool: 8 -> 12 replicas" },
  { id: "au4", timestamp: "14:15:00", actor: "cert-manager", action: "Renewed", resource: "TLS cert *.agentping.dev" },
  { id: "au5", timestamp: "14:10:33", actor: "admin@agentping.dev", action: "Rotated", resource: "API key: sk-prod-***7f3a" },
  { id: "au6", timestamp: "13:58:12", actor: "watchdog", action: "Triggered", resource: "Alert: memory-pressure-node03" },
];

const terminalLines = [
  { text: "lev diagnose --target production", type: "input" as const },
  { text: "Running connectivity tests...", type: "system" as const },
  { text: "  [PASS] API Gateway (api.agentping.dev:443) - 12ms", type: "output" as const },
  { text: "  [PASS] PostgreSQL (pg-primary:5432) - 3ms", type: "output" as const },
  { text: "  [FAIL] PostgreSQL Replica (pg-replica-02:5432) - ECONNREFUSED", type: "error" as const },
  { text: "  [PASS] Redis Cluster (redis-east:6379) - 1ms", type: "output" as const },
  { text: "  [PASS] Knowledge Index (index:8080) - 142ms", type: "output" as const },
  { text: "  [WARN] Knowledge Index latency > 100ms threshold", type: "error" as const },
  { text: "Diagnostics complete: 5 passed, 1 failed, 1 warning", type: "system" as const },
  { text: "tail -f /var/log/agentping/api.log | grep ERROR", type: "input" as const },
  { text: "[14:32:07.844] ERROR: Timeout: upstream 'knowledge-index' 5000ms", type: "error" as const },
  { text: "[14:32:06.543] ERROR: ECONNREFUSED postgres-replica-02:5432", type: "error" as const },
];

const errorClusters = [
  { id: "e1", message: "ECONNREFUSED: postgres-replica-02:5432", count: 47, lastSeen: "14s ago" },
  { id: "e2", message: "Timeout: upstream 'knowledge-index' > 5000ms", count: 12, lastSeen: "23s ago" },
  { id: "e3", message: "Rate limit exceeded: 185.22.134.x", count: 8, lastSeen: "2m ago" },
  { id: "e4", message: "JSON parse error in request body (agent-create)", count: 3, lastSeen: "5m ago" },
];

const latencyBuckets = [
  { label: "<10ms", count: 4200 },
  { label: "10-50ms", count: 3800 },
  { label: "50-100ms", count: 1200 },
  { label: "100-250ms", count: 340 },
  { label: "250-500ms", count: 88 },
  { label: "500ms-1s", count: 22 },
  { label: ">1s", count: 7 },
];

const stackFrames = [
  { file: "src/services/knowledge-client.ts", line: 142, column: 18, function: "fetchEmbeddings" },
  { file: "src/services/knowledge-client.ts", line: 98, column: 5, function: "queryIndex" },
  { file: "src/handlers/agent-create.ts", line: 67, column: 12, function: "enrichAgentProfile" },
  { file: "src/handlers/agent-create.ts", line: 34, column: 3, function: "handleCreate" },
  { file: "src/router.ts", line: 221, column: 9, function: "routeRequest" },
  { file: "node_modules/hono/dist/router.js", line: 44, column: 11, function: "dispatch", isNative: true },
];

const diagnosticTests = [
  { id: "d1", name: "API Gateway Connectivity", status: "pass" as const, latency: 12 },
  { id: "d2", name: "PostgreSQL Primary", status: "pass" as const, latency: 3 },
  { id: "d3", name: "PostgreSQL Replica", status: "fail" as const, message: "ECONNREFUSED" },
  { id: "d4", name: "Redis Cluster", status: "pass" as const, latency: 1 },
  { id: "d5", name: "Knowledge Index", status: "pass" as const, latency: 142, message: "Latency warning" },
  { id: "d6", name: "Certificate Validity", status: "pass" as const },
  { id: "d7", name: "Disk Space", status: "pass" as const },
  { id: "d8", name: "DNS Resolution", status: "pass" as const, latency: 2 },
];

const diagStats = [
  { label: "Total Errors (1h)", value: 70 },
  { label: "Avg Latency", value: "48ms" },
  { label: "Uptime", value: "99.94%" },
  { label: "Active Alerts", value: 3 },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function LogsDiagnosticsWorkbench() {
  const [activeTab, setActiveTab] = useState<"logs" | "audit" | "terminal">("logs");

  const tabs = [
    { key: "logs" as const, label: "Log Stream" },
    { key: "audit" as const, label: "Audit Trail" },
    { key: "terminal" as const, label: "Terminal" },
  ];

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/40 text-xs">[DIAG]</span>
          <h1 className="text-lg text-cyan-400">Logs & Diagnostics Workbench</h1>
        </div>
        <div className="flex gap-4">
          <StatusIndicator status="online" label="Log pipeline" />
          <StatusIndicator status="busy" label="1 alert active" />
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pt-4">
        <StatsGrid stats={diagStats} columns={4} />
      </div>

      {/* Tab bar */}
      <div className="px-6 pt-4 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-t border border-b-0 transition-colors ${
              activeTab === tab.key
                ? "border-cyan-500/30 bg-black/60 text-cyan-400"
                : "border-transparent text-cyan-500/40 hover:text-cyan-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="px-6 pb-6">
        <div className="border border-cyan-500/20 bg-black/40 rounded-b-lg rounded-tr-lg p-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Left — Main log/audit/terminal view */}
            <div className="col-span-8 space-y-4">
              {activeTab === "logs" && (
                <>
                  <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">LOG VOLUME</div>
                  <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-3">
                    <LogHistogram data={logHistogramData} height={80} />
                  </div>
                  <LogStream entries={logEntries} />
                </>
              )}
              {activeTab === "audit" && <AuditLogViewer logs={auditLogs} />}
              {activeTab === "terminal" && <TerminalView lines={terminalLines} />}
            </div>

            {/* Right — Error clusters + Stack trace + Diagnostics */}
            <div className="col-span-4 space-y-4">
              <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">ERROR CLUSTERS</div>
                <ErrorCluster errors={errorClusters} />
              </div>

              <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">LATENCY DISTRIBUTION</div>
                <LatencyHistogram data={latencyBuckets} height={120} />
              </div>

              <StackTraceProfiler
                error="TimeoutError: upstream service 'knowledge-index' did not respond within 5000ms"
                frames={stackFrames}
              />

              <DiagnosticPanel tests={diagnosticTests} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story config
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Pages/Logs & Diagnostics Workbench",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <LogsDiagnosticsWorkbench /> };
