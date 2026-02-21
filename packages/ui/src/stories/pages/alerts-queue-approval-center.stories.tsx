// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TaskQueue } from "../../components/migrations/task-queue";
import { LeaseApproval } from "../../components/migrations/lease-approval";
import { StepChecklist } from "../../components/migrations/step-checklist";
import { SelectionList } from "../../components/migrations/selection-list";
import { TeamRoster } from "../../components/migrations/team-roster";
import { TransferList } from "../../components/migrations/transfer-list";
import { ApprovalQueue } from "../../components/migrations/approval-queue";
import { AlertFeed } from "../../components/migrations/alert-feed";
import { TaskChecklist } from "../../components/migrations/task-checklist";
import { StatusIndicator } from "../../components/migrations/status-indicator";
import { StatsGrid } from "../../components/migrations/stats-grid";
import { AlertBanner } from "../../components/migrations/alert-banner";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const queueTasks = [
  { id: "tq-1", title: "Deploy api-gateway v3.8.1 to production", status: "running" as const, priority: 9 },
  { id: "tq-2", title: "Scale worker-pool to 16 replicas", status: "queued" as const, priority: 7 },
  { id: "tq-3", title: "Rotate API keys for staging environment", status: "queued" as const, priority: 5 },
  { id: "tq-4", title: "Run full regression test suite", status: "queued" as const, priority: 6 },
  { id: "tq-5", title: "Update TLS certificates for *.agentping.dev", status: "done" as const, priority: 8 },
  { id: "tq-6", title: "Migrate legacy sessions to v2 schema", status: "failed" as const, priority: 4 },
  { id: "tq-7", title: "Purge expired embeddings from vector store", status: "queued" as const, priority: 3 },
  { id: "tq-8", title: "Enable canary deployment for auth-service", status: "queued" as const, priority: 6 },
];

const leases = [
  { id: "lease-1", agent: "Opus Agent", resource: "gpu-cluster-east", status: "pending" as const, requestedAt: "14:28:00 UTC", expiresAt: "2026-02-13T15:28:00Z" },
  { id: "lease-2", agent: "Research Bot", resource: "knowledge-index (write)", status: "active" as const, requestedAt: "14:15:00 UTC", expiresAt: "2026-02-13T16:15:00Z" },
  { id: "lease-3", agent: "Deploy Agent", resource: "production-cluster", status: "pending" as const, requestedAt: "14:30:12 UTC", expiresAt: "2026-02-13T14:45:12Z" },
  { id: "lease-4", agent: "Code Reviewer", resource: "staging-db (read)", status: "expired" as const, requestedAt: "13:00:00 UTC", expiresAt: "2026-02-13T14:00:00Z" },
];

const checklistItems = [
  { label: "Pre-deploy health checks passed", checked: true },
  { label: "Database migration scripts reviewed", checked: true },
  { label: "Rollback plan documented", checked: true },
  { label: "Load testing completed (> 10k RPS)", checked: false },
  { label: "Security scan passed (0 critical)", checked: false },
  { label: "Stakeholder sign-off obtained", checked: false },
];

const pendingApprovals = [
  {
    id: "ap-1",
    toolName: "Bash",
    description: "Execute deployment script for api-gateway v3.8.1",
    input: { command: "deploy --service api-gateway --version 3.8.1 --env production" },
    timestamp: new Date("2026-02-13T14:30:00Z"),
  },
  {
    id: "ap-2",
    toolName: "Edit",
    description: "Modify production config to increase worker pool size",
    input: { file_path: "/etc/agentping/workers.yaml", old_string: "replicas: 8", new_string: "replicas: 16" },
    timestamp: new Date("2026-02-13T14:31:00Z"),
  },
  {
    id: "ap-3",
    toolName: "Bash",
    description: "Rotate API keys and update secrets manager",
    input: { command: "lev secrets rotate --scope staging --confirm" },
    timestamp: new Date("2026-02-13T14:32:00Z"),
  },
];

const alerts = [
  { id: "al-1", severity: "critical" as const, title: "PostgreSQL replica down", message: "pg-replica-02 is not responding to health checks", timestamp: "14:32:07", source: "watchdog" },
  { id: "al-2", severity: "high" as const, title: "Memory pressure on node-03", message: "Heap utilization at 91%, approaching OOM threshold", timestamp: "14:31:55", source: "metrics" },
  { id: "al-3", severity: "medium" as const, title: "Elevated error rate", message: "Error rate increased from 0.01% to 0.03% in last 5 minutes", timestamp: "14:30:22", source: "sli-monitor" },
  { id: "al-4", severity: "low" as const, title: "Certificate renewal scheduled", message: "TLS cert for *.agentping.dev expires in 89 days", timestamp: "14:25:00", source: "cert-manager" },
  { id: "al-5", severity: "medium" as const, title: "Rate limiting active", message: "IP 185.22.134.x throttled: 142 req/10s exceeds 100 limit", timestamp: "14:29:41", source: "gateway" },
];

const taskSteps = [
  { id: "ts-1", title: "Validate deployment manifest", status: "complete" as const, agent: "Deploy Agent" },
  { id: "ts-2", title: "Run pre-deploy health checks", status: "complete" as const, agent: "QA Validator" },
  { id: "ts-3", title: "Apply database migrations", status: "in_progress" as const, agent: "Deploy Agent" },
  { id: "ts-4", title: "Deploy canary to 10% traffic", status: "waiting_approval" as const, agent: "Deploy Agent" },
  { id: "ts-5", title: "Monitor canary metrics (15 min)", status: "pending" as const },
  { id: "ts-6", title: "Promote to full production", status: "pending" as const },
];

const teamMembers = [
  { name: "Sarah Chen", role: "Ops Lead", status: "online" as const },
  { name: "Marcus Webb", role: "SRE", status: "online" as const },
  { name: "Priya Patel", role: "Backend Eng", status: "away" as const },
  { name: "Jake Morrison", role: "Security", status: "online" as const },
  { name: "Aisha Koroma", role: "DevOps", status: "offline" as const },
  { name: "Tom Nguyen", role: "Platform Eng", status: "online" as const },
];

const selectionItems = [
  { id: "s1", label: "api-gateway" },
  { id: "s2", label: "auth-service" },
  { id: "s3", label: "worker-pool" },
  { id: "s4", label: "knowledge-index" },
  { id: "s5", label: "session-manager" },
];

const transferAvailable = [
  { id: "tr1", label: "Staging East" },
  { id: "tr2", label: "Staging West" },
  { id: "tr3", label: "Dev Cluster" },
  { id: "tr4", label: "QA Environment" },
];
const transferSelected = [
  { id: "tr5", label: "Production East" },
  { id: "tr6", label: "Production West" },
];

const queueStats = [
  { label: "Pending Tasks", value: 5 },
  { label: "Active Leases", value: 2 },
  { label: "Pending Approvals", value: 3 },
  { label: "Active Alerts", value: 5, change: -20 },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function AlertsQueueApprovalCenter() {
  const [checklist, setChecklist] = useState(checklistItems);

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/40 text-xs">[Q&A]</span>
          <h1 className="text-lg text-cyan-400">Alerts, Queues & Approvals</h1>
        </div>
        <div className="flex gap-4">
          <StatusIndicator status="busy" label="3 pending" />
          <StatusIndicator status="online" label="Pipeline" />
        </div>
      </div>

      {/* Critical alert */}
      <div className="px-6 pt-3">
        <AlertBanner type="error" title="Action Required" message="pg-replica-02 is offline — 3 pending approvals require human sign-off before deploy continues" />
      </div>

      {/* Stats */}
      <div className="px-6 pt-3">
        <StatsGrid stats={queueStats} columns={4} />
      </div>

      {/* Main grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left — Task queue + Alerts */}
        <div className="col-span-3 space-y-4">
          <TaskQueue tasks={queueTasks} />
          <AlertFeed alerts={alerts} />
        </div>

        {/* Center — Approvals + Leases + Checklist */}
        <div className="col-span-6 space-y-4">
          {/* Tool approvals */}
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">TOOL APPROVAL QUEUE</div>
            <ApprovalQueue approvals={pendingApprovals} />
          </div>

          {/* Lease approvals */}
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">RESOURCE LEASES</div>
            <div className="grid grid-cols-2 gap-3">
              {leases.map((lease) => (
                <LeaseApproval key={lease.id} {...lease} />
              ))}
            </div>
          </div>

          {/* Deploy checklist */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
              <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">DEPLOY CHECKLIST</div>
              <StepChecklist
                items={checklist}
                onToggle={(i) => {
                  const next = [...checklist];
                  next[i] = { ...next[i], checked: !next[i].checked };
                  setChecklist(next);
                }}
              />
            </div>

            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
              <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">DEPLOY PIPELINE</div>
              <TaskChecklist steps={taskSteps} />
            </div>
          </div>
        </div>

        {/* Right — Team + Selection + Transfer */}
        <div className="col-span-3 space-y-4">
          <TeamRoster members={teamMembers} />

          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">AFFECTED SERVICES</div>
            <SelectionList
              items={selectionItems.map((s, i) => ({ ...s, selected: i < 2 }))}
            />
          </div>

          <div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">DEPLOY TARGETS</div>
            <TransferList available={transferAvailable} selected={transferSelected} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyQueues() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      <div className="border-b border-cyan-500/10 px-6 py-3">
        <h1 className="text-lg text-cyan-400">Alerts, Queues & Approvals</h1>
      </div>
      <div className="px-6 pt-4">
        <AlertBanner type="success" message="All clear — no pending approvals, alerts, or queued tasks" />
      </div>
      <div className="p-6 grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <TaskQueue tasks={[]} />
        </div>
        <div className="col-span-4">
          <ApprovalQueue approvals={[]} />
        </div>
        <div className="col-span-4">
          <AlertFeed alerts={[]} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story config
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Pages/Alerts, Queues & Approvals",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <AlertsQueueApprovalCenter /> };
export const Empty: Story = { render: () => <EmptyQueues /> };
