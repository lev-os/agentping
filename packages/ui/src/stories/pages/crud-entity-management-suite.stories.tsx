import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { StepChecklist } from "../../components/catalog/step-checklist";
import { TaskWorkflow, type WorkflowStage } from "../../components/catalog/task-workflow";
import { WizardStep } from "../../components/catalog/wizard-step";
import { PropertyGrid, type PropertyGridItem } from "../../components/catalog/property-grid";
import { SelectionList, type SelectionOption } from "../../components/catalog/selection-list";
import { ApprovalQueue, type PendingApproval } from "../../components/catalog/approval-queue";
import { TaskChecklist, type TaskStep } from "../../components/catalog/task-checklist";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const ENTITIES = [
  { id: "agt-001", name: "Cipher", type: "Security", status: "active", model: "claude-opus-4-6", tasks: 142, uptime: "99.7%" },
  { id: "agt-002", name: "Aegis", type: "DevOps", status: "active", model: "claude-sonnet-4-5", tasks: 89, uptime: "98.2%" },
  { id: "agt-003", name: "Nova", type: "Research", status: "idle", model: "claude-opus-4-6", tasks: 67, uptime: "97.1%" },
  { id: "agt-004", name: "Sentinel", type: "Monitoring", status: "offline", model: "claude-haiku-4-5", tasks: 234, uptime: "95.8%" },
  { id: "agt-005", name: "Forge", type: "Builder", status: "active", model: "claude-sonnet-4-5", tasks: 178, uptime: "99.1%" },
  { id: "agt-006", name: "Oracle", type: "Analytics", status: "idle", model: "claude-opus-4-6", tasks: 56, uptime: "96.4%" },
];

const PROPERTY_ITEMS: PropertyGridItem[] = [
  { key: "Agent ID", value: "agt-001", category: "Identity" },
  { key: "Name", value: "Cipher", category: "Identity" },
  { key: "Model", value: "claude-opus-4-6", category: "Config" },
  { key: "Temperature", value: 0.7, category: "Config" },
  { key: "Max Tokens", value: 4096, category: "Config" },
  { key: "Status", value: "active", category: "Runtime" },
  { key: "Uptime", value: "99.7%", category: "Runtime" },
  { key: "Total Tasks", value: 142, category: "Metrics" },
  { key: "Avg Latency", value: "230ms", category: "Metrics" },
  { key: "Error Rate", value: "0.3%", category: "Metrics" },
];

const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: "s1", label: "Provision", status: "completed", tasks: [{ title: "Allocate compute", done: true }, { title: "Load model weights", done: true }] },
  { id: "s2", label: "Configure", status: "completed", tasks: [{ title: "Set system prompt", done: true }, { title: "Bind tools", done: true }] },
  { id: "s3", label: "Validate", status: "active", tasks: [{ title: "Run smoke tests", done: true }, { title: "Verify tool access", done: false }] },
  { id: "s4", label: "Deploy", status: "pending", tasks: [{ title: "Enable routing", done: false }, { title: "Notify squad", done: false }] },
];

const APPROVAL_ITEMS: PendingApproval[] = [
  { id: "ap1", toolName: "bash", description: "rm -rf /tmp/agent-cache/*", timestamp: new Date("2026-02-13T14:20:00"), diff: "Clearing 2.3GB of stale cache" },
  { id: "ap2", toolName: "write_file", description: "Update /etc/lev/agents.yaml", timestamp: new Date("2026-02-13T14:21:30") },
  { id: "ap3", toolName: "deploy", description: "Push agt-003 to production cluster", timestamp: new Date("2026-02-13T14:22:15"), diff: "+agent: Nova\n+model: claude-opus-4-6\n+region: us-east-1" },
];

const TASK_STEPS: TaskStep[] = [
  { id: "ts1", title: "Initialize agent runtime", status: "complete", agent: "Forge" },
  { id: "ts2", title: "Load configuration schema", status: "complete", agent: "Forge" },
  { id: "ts3", title: "Bind MCP tool endpoints", status: "in_progress", agent: "Cipher" },
  { id: "ts4", title: "Run integration tests", status: "pending", agent: "Aegis" },
  { id: "ts5", title: "Deploy to staging", status: "waiting_approval", agent: "Sentinel" },
];

const CHECKLIST_ITEMS = [
  { label: "Identity configured", checked: true },
  { label: "Model assigned", checked: true },
  { label: "Tools bound", checked: false },
  { label: "Tests passing", checked: false },
  { label: "Approved for deploy", checked: false },
];

const SELECTION_OPTIONS: SelectionOption[] = [
  { id: "bash", label: "bash", description: "Execute shell commands" },
  { id: "read", label: "read_file", description: "Read file contents" },
  { id: "write", label: "write_file", description: "Write to files" },
  { id: "search", label: "grep_search", description: "Search codebase" },
  { id: "deploy", label: "deploy", description: "Deploy to environment" },
];

const STATUS_COLOR: Record<string, string> = {
  active: "text-green-400",
  idle: "text-amber-400",
  offline: "text-red-400",
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function CrudEntityManagementSuite() {
  const [selected, setSelected] = useState<string | null>("agt-001");
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedTools, setSelectedTools] = useState(new Set(["bash", "read", "search"]));

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 bg-black/95 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm text-cyan-400 uppercase tracking-widest">Agent Registry</h1>
          <p className="text-[10px] text-cyan-500/40 mt-0.5">{ENTITIES.length} agents configured — 3 active, 2 idle, 1 offline</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs border border-cyan-500/20 rounded-md hover:bg-cyan-500/10 text-cyan-400">
            + New Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr_300px] h-[calc(100vh-52px)]">
        {/* Left — Entity table */}
        <div className="border-r border-cyan-500/10 overflow-y-auto">
          <div className="px-4 py-2 border-b border-cyan-500/5 text-[10px] text-cyan-500/40 uppercase tracking-widest">
            Agent List
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyan-500/5 text-cyan-500/60">
                <th className="text-left px-4 py-2 font-normal">Name</th>
                <th className="text-left px-2 py-2 font-normal">Type</th>
                <th className="text-left px-2 py-2 font-normal">Status</th>
                <th className="text-right px-4 py-2 font-normal">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {ENTITIES.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e.id)}
                  className={`border-b border-cyan-500/5 cursor-pointer transition-colors ${
                    selected === e.id ? "bg-cyan-500/10" : "hover:bg-cyan-500/5"
                  }`}
                >
                  <td className="px-4 py-2 text-cyan-300">{e.name}</td>
                  <td className="px-2 py-2 text-cyan-500/60">{e.type}</td>
                  <td className={`px-2 py-2 ${STATUS_COLOR[e.status]}`}>{e.status}</td>
                  <td className="px-4 py-2 text-right text-cyan-500/60">{e.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Step checklist below table */}
          <div className="p-4 border-t border-cyan-500/10">
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-2">Deploy Checklist</div>
            <StepChecklist items={CHECKLIST_ITEMS} />
          </div>
        </div>

        {/* Center — Detail view with workflow + wizard */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Workflow pipeline */}
          <TaskWorkflow
            stages={WORKFLOW_STAGES}
            title="Agent Provisioning Pipeline"
            description="Deploy Cipher (agt-001) to production cluster with full tool binding"
          />

          {/* Wizard step */}
          <WizardStep
            title="Bind Tool Endpoints"
            description="Select the MCP tools this agent can access in production."
            stepNumber={wizardStep}
            totalSteps={4}
            isFirst={wizardStep === 1}
            isLast={wizardStep === 4}
            onNext={() => setWizardStep(Math.min(4, wizardStep + 1))}
            onBack={() => setWizardStep(Math.max(1, wizardStep - 1))}
          >
            <SelectionList
              options={SELECTION_OPTIONS}
              selectedOptions={selectedTools}
              onOptionToggle={(id) => {
                const next = new Set(selectedTools);
                next.has(id) ? next.delete(id) : next.add(id);
                setSelectedTools(next);
              }}
            />
          </WizardStep>

          {/* Task checklist */}
          <TaskChecklist steps={TASK_STEPS} />

          {/* Approval queue */}
          <ApprovalQueue approvals={APPROVAL_ITEMS} />
        </div>

        {/* Right — Property grid */}
        <div className="border-l border-cyan-500/10 overflow-y-auto">
          <PropertyGrid items={PROPERTY_ITEMS} title="Agent Properties" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/CRUD Entity Management Suite",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <CrudEntityManagementSuite />,
};
