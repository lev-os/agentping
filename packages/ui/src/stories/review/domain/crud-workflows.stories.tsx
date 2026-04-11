import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { StepChecklist } from "../../../components/migrations/step-checklist";
import { TaskWorkflow } from "../../../components/migrations/task-workflow";
import { WizardStep } from "../../../components/migrations/wizard-step";
import { PropertyGrid } from "../../../components/migrations/property-grid";
import { SelectionList } from "../../../components/migrations/selection-list";
import { ApprovalQueue } from "../../../components/migrations/approval-queue";
import { TaskQueue } from "../../../components/migrations/task-queue";
import { TransferList } from "../../../components/migrations/transfer-list";

/**
 * NOTE: EntityForm and FieldRenderer are excluded from this review page.
 * They require <CrudProvider> context with a full config object
 * (useCrudContext dependency). They need to be reviewed with their
 * provider wired up in a dedicated CRUD recipe story.
 */

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const checklistItems = [
  { label: "Configure API keys", checked: true },
  { label: "Set up webhook endpoints", checked: true },
  { label: "Enable rate limiting", checked: false },
  { label: "Configure CORS origins", checked: false },
  { label: "Set up monitoring alerts", checked: false },
];

const workflowStages = [
  {
    id: "build",
    label: "Build",
    status: "completed" as const,
    tasks: [
      { title: "Compile TypeScript", done: true },
      { title: "Run linter", done: true },
      { title: "Bundle assets", done: true },
    ],
  },
  {
    id: "test",
    label: "Test",
    status: "completed" as const,
    tasks: [
      { title: "Unit tests", done: true },
      { title: "Integration tests", done: true },
      { title: "E2E tests", done: true },
    ],
  },
  {
    id: "review",
    label: "Code Review",
    status: "active" as const,
    tasks: [
      { title: "Security review", done: true },
      { title: "Architecture review", done: false },
      { title: "Performance review", done: false },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    status: "pending" as const,
    tasks: [
      { title: "Canary rollout", done: false },
      { title: "Health checks", done: false },
      { title: "Full rollout", done: false },
    ],
  },
];

const propertyItems = [
  { key: "Name", value: "agent-alpha" },
  { key: "Status", value: "Active" },
  { key: "Region", value: "us-east-1" },
  { key: "CPU Cores", value: 4 },
  { key: "Memory", value: "8 GB" },
  { key: "GPU", value: false },
  { key: "Runtime", value: "v2.4.1" },
  { key: "Uptime", value: "14d 6h 32m" },
];

const selectionItems = [
  { id: "1", label: "agent-alpha", selected: true },
  { id: "2", label: "agent-beta", selected: false },
  { id: "3", label: "agent-gamma", selected: true },
  { id: "4", label: "agent-delta", selected: false },
  { id: "5", label: "agent-epsilon", selected: false },
];

const pendingApprovals = [
  {
    id: "1",
    toolName: "file_write",
    description: "Write deployment config to production manifest",
    input: { path: "/etc/lev/deploy.yaml", mode: "overwrite" },
    timestamp: new Date("2026-02-13T08:00:00"),
  },
  {
    id: "2",
    toolName: "shell_exec",
    description: "Execute database migration script",
    input: { command: "lev db migrate --env production" },
    timestamp: new Date("2026-02-13T08:05:00"),
  },
  {
    id: "3",
    toolName: "api_call",
    description: "Trigger webhook notification to Slack",
    input: { url: "https://hooks.slack.com/...", method: "POST" },
    timestamp: new Date("2026-02-13T08:10:00"),
  },
];

const queuedTasks = [
  { id: "1", title: "Process embedding batch #4821", status: "running" as const, priority: 9 },
  { id: "2", title: "Sync agent configs from remote", status: "queued" as const, priority: 7 },
  { id: "3", title: "Generate weekly analytics report", status: "queued" as const, priority: 4 },
  { id: "4", title: "Cleanup expired session tokens", status: "done" as const, priority: 2 },
  { id: "5", title: "Archive old deployment logs", status: "failed" as const, priority: 1 },
];

const availableItems = [
  { id: "a1", label: "Read access" },
  { id: "a2", label: "Write access" },
  { id: "a3", label: "Execute access" },
  { id: "a4", label: "Admin access" },
];

const selectedItems = [
  { id: "s1", label: "Deploy access" },
  { id: "s2", label: "Monitor access" },
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

function CrudWorkflowsReview() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cyan-100 font-mono">CRUD & Workflows</h1>
          <p className="text-sm text-cyan-500/60 mt-1 font-mono">
            8 components -- checklists, workflows, wizards, property grids, queues, transfers
          </p>
          <p className="text-xs text-amber-400/60 mt-2 font-mono">
            Note: EntityForm + FieldRenderer excluded (require CrudProvider context)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card title="StepChecklist">
            <StepChecklist items={checklistItems} />
          </Card>

          <Card title="TaskWorkflow" span={2}>
            <TaskWorkflow
              stages={workflowStages}
              title="Release Pipeline"
              description="Automated CI/CD workflow for production deployments"
            />
          </Card>

          <Card title="WizardStep (Step 2 of 4)">
            <WizardStep
              title="Configure Agent"
              description="Set the runtime parameters for your new agent instance."
              stepNumber={2}
              totalSteps={4}
              isFirst={false}
            >
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-cyan-400 font-mono block mb-1">Agent Name</label>
                  <input
                    type="text"
                    defaultValue="agent-zeta"
                    className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-1.5 text-sm text-cyan-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-400 font-mono block mb-1">Memory Limit</label>
                  <input
                    type="text"
                    defaultValue="4096 MB"
                    className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-1.5 text-sm text-cyan-100 font-mono"
                  />
                </div>
              </div>
            </WizardStep>
          </Card>

          <Card title="PropertyGrid">
            <PropertyGrid items={propertyItems} title="Agent Properties" />
          </Card>

          <Card title="SelectionList">
            <SelectionList items={selectionItems} />
          </Card>

          <Card title="ApprovalQueue" span={2}>
            <ApprovalQueue approvals={pendingApprovals} />
          </Card>

          <Card title="TaskQueue">
            <TaskQueue tasks={queuedTasks} />
          </Card>

          <Card title="TransferList">
            <TransferList available={availableItems} selected={selectedItems} />
          </Card>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Review/Domain/CRUD & Workflows",
  component: CrudWorkflowsReview,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
