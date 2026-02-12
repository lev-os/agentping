"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { LiveLogStream } from "./live-log-stream";
import { AlertFeed } from "./alert-feed";
import { AuditLogTable } from "./audit-log-table";
import { BuildStatusLogs } from "./build-status-logs";
import { DistributedTrace } from "./distributed-trace";
import { HttpInspector } from "./http-inspector";
import { EventTimeline } from "./event-timeline";
import { StackTraceProfiler } from "./stack-trace-profiler";

export interface GalleryLogsSectionProps { className?: string; }

const demoLogLines = [
  { id: "l1", timestamp: "14:32:01", level: "info" as const, message: "Service started on port 3000" },
  { id: "l2", timestamp: "14:32:02", level: "debug" as const, message: "Connected to database" },
  { id: "l3", timestamp: "14:32:03", level: "warn" as const, message: "Cache miss rate above threshold" },
  { id: "l4", timestamp: "14:32:04", level: "error" as const, message: "Failed to connect to Redis" },
  { id: "l5", timestamp: "14:32:05", level: "info" as const, message: "Retry succeeded, connection restored" },
];

const demoAlerts = [
  { id: "a1", severity: "critical" as const, title: "CPU > 95%", message: "Node prod-3 exceeded threshold", timestamp: "14:30", source: "monitoring" },
  { id: "a2", severity: "high" as const, title: "Disk space low", message: "/var at 92% capacity", timestamp: "14:25", source: "infra" },
  { id: "a3", severity: "medium" as const, title: "Slow queries", message: "p99 latency > 500ms", timestamp: "14:20", source: "db" },
];

const demoAuditEntries = [
  { id: "e1", timestamp: "14:30:01", user: "admin", action: "deploy", resource: "api-v2", status: "success" as const },
  { id: "e2", timestamp: "14:28:15", user: "ci-bot", action: "build", resource: "frontend", status: "success" as const },
  { id: "e3", timestamp: "14:25:33", user: "dev-1", action: "delete", resource: "staging-db", status: "failure" as const },
];

const demoBuildSteps = [
  { id: "s1", name: "Install dependencies", status: "success" as const, duration: "12s" },
  { id: "s2", name: "Lint & type check", status: "success" as const, duration: "8s" },
  { id: "s3", name: "Run tests", status: "running" as const, duration: "..." },
  { id: "s4", name: "Build artifacts", status: "pending" as const },
  { id: "s5", name: "Deploy", status: "pending" as const },
];

const demoSpans = [
  { id: "sp1", name: "request", service: "gateway", duration: 245, start: 0, status: "ok" as const },
  { id: "sp2", name: "auth", service: "auth-svc", duration: 45, start: 10, status: "ok" as const },
  { id: "sp3", name: "query", service: "db", duration: 120, start: 60, status: "ok" as const },
  { id: "sp4", name: "cache", service: "redis", duration: 15, start: 55, status: "error" as const },
];

const demoHttpRequests = [
  { id: "r1", method: "GET" as const, url: "/api/v2/users", status: 200, duration: 45, timestamp: "14:32:01" },
  { id: "r2", method: "POST" as const, url: "/api/v2/deploy", status: 201, duration: 1200, timestamp: "14:32:00" },
  { id: "r3", method: "DELETE" as const, url: "/api/v2/cache", status: 500, duration: 30, timestamp: "14:31:58" },
];

const demoEvents = [
  { id: "ev1", timestamp: "14:32", title: "Deployment started", type: "info" as const, source: "ci/cd" },
  { id: "ev2", timestamp: "14:30", title: "Tests passed", description: "All 142 tests green", type: "success" as const, source: "test-runner" },
  { id: "ev3", timestamp: "14:28", title: "Build warning", description: "Unused variable in auth.ts", type: "warning" as const, source: "compiler" },
  { id: "ev4", timestamp: "14:25", title: "Connection timeout", description: "Redis unreachable for 3s", type: "error" as const, source: "monitoring" },
];

const demoFrames = [
  { file: "src/api/handler.ts", line: 42, column: 12, function: "handleRequest" },
  { file: "src/middleware/auth.ts", line: 18, column: 5, function: "validateToken" },
  { file: "src/lib/jwt.ts", line: 67, column: 8, function: "verify" },
  { file: "node_modules/jsonwebtoken/index.js", line: 112, column: 3, function: "decode", isNative: true },
];

export function GalleryLogsSection({ className }: GalleryLogsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Log Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="LiveLogStream">
          <LiveLogStream lines={demoLogLines} />
        </GalleryCard>
        <GalleryCard name="AlertFeed">
          <AlertFeed alerts={demoAlerts} />
        </GalleryCard>
        <GalleryCard name="AuditLogTable" className="col-span-2">
          <AuditLogTable entries={demoAuditEntries} />
        </GalleryCard>
        <GalleryCard name="BuildStatusLogs">
          <BuildStatusLogs steps={demoBuildSteps} buildId="1847" />
        </GalleryCard>
        <GalleryCard name="DistributedTrace">
          <DistributedTrace spans={demoSpans} traceId="abc-123-def" totalDuration={300} />
        </GalleryCard>
        <GalleryCard name="HttpInspector" className="col-span-2">
          <HttpInspector requests={demoHttpRequests} />
        </GalleryCard>
        <GalleryCard name="EventTimeline">
          <EventTimeline events={demoEvents} />
        </GalleryCard>
        <GalleryCard name="StackTraceProfiler">
          <StackTraceProfiler frames={demoFrames} error="TypeError: Cannot read property 'sub' of undefined" />
        </GalleryCard>
      </div>
    </div>
  );
}
