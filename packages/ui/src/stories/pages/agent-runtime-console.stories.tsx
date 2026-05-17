import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { AgentAvatar } from "../../components/catalog/agent-avatar";
import { BrainActivity } from "../../components/catalog/brain-activity";
import { ToolInvocation } from "../../components/catalog/tool-invocation";
import { TokenStream } from "../../components/catalog/token-stream";
import { ContextUsage } from "../../components/catalog/context-usage";
import { ModelSelector } from "../../components/catalog/model-selector";
import { PromptEditor } from "../../components/catalog/prompt-editor";
import { StepTracker } from "../../components/catalog/step-tracker";
import { StatusIndicator } from "../../components/catalog/status-indicator";
import { MetricChart } from "../../components/catalog/metric-chart";
import { StatsGrid } from "../../components/catalog/stats-grid";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const brainRegions = [
  { name: "Planning", activity: 92 },
  { name: "Reasoning", activity: 78 },
  { name: "Tool Use", activity: 64 },
  { name: "Memory Recall", activity: 45 },
  { name: "Code Gen", activity: 88 },
  { name: "Self-Critique", activity: 31 },
];

const toolCalls = [
  {
    name: "Read",
    args: { file_path: "/src/components/Dashboard.tsx" },
    result: "// 142 lines of React component...",
    status: "success" as const,
    duration: 23,
  },
  {
    name: "Grep",
    args: { pattern: "useEffect", path: "/src/" },
    result: "Found 14 matches in 8 files",
    status: "success" as const,
    duration: 87,
  },
  {
    name: "Edit",
    args: { file_path: "/src/utils/api.ts", old_string: "fetch(", new_string: "safeFetch(" },
    status: "running" as const,
    duration: undefined,
  },
  {
    name: "Bash",
    args: { command: "pnpm test --filter @app/core" },
    status: "pending" as const,
    duration: undefined,
  },
];

const tokens = [
  "I'll ", "analyze ", "the ", "Dashboard ", "component ", "and ", "identify ",
  "the ", "performance ", "bottleneck. ", "The ", "useEffect ", "on ", "line ",
  "47 ", "is ", "missing ", "a ", "dependency ", "array, ", "causing ", "an ",
  "infinite ", "re-render ", "loop. ", "Let ", "me ", "fix ", "that ", "now.",
];

const models = [
  { id: "opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic", description: "Most capable, best for complex tasks" },
  { id: "sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", description: "Balanced speed and capability" },
  { id: "haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", description: "Fastest response time" },
];

const steps = [
  { label: "Parse user request", status: "completed" as const },
  { label: "Read target files", status: "completed" as const },
  { label: "Analyze code structure", status: "completed" as const },
  { label: "Apply code changes", status: "active" as const },
  { label: "Run test suite", status: "pending" as const },
  { label: "Generate summary", status: "pending" as const },
];

const agentStats = [
  { label: "Tokens In", value: "24,891" },
  { label: "Tokens Out", value: "3,412" },
  { label: "Tool Calls", value: 7 },
  { label: "Elapsed", value: "1m 34s" },
];

const tokenRateData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i * 3}s`,
  value: 40 + Math.floor(Math.random() * 60),
}));

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function AgentRuntimeConsole() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AgentAvatar name="Opus Agent" status="speaking" size="lg" />
          <div>
            <h1 className="text-lg text-cyan-400">Agent Runtime Console</h1>
            <div className="text-xs text-cyan-500/50 mt-0.5">Session: agt-7f3a · PID 2841 · opus-4.6</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusIndicator status="online" label="Connected" />
          <StatusIndicator status="busy" label="Executing" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-6 pt-4">
        <StatsGrid stats={agentStats} columns={4} />
      </div>

      {/* Main layout */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left panel — Agent info + Brain + Steps */}
        <div className="col-span-4 space-y-4">
          {/* Brain activity */}
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">NEURAL ACTIVITY</div>
            <BrainActivity regions={brainRegions} />
          </div>

          {/* Step tracker */}
          <StepTracker steps={steps} />

          {/* Context usage */}
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-3">
            <div className="text-xs text-cyan-400 uppercase tracking-wider">CONTEXT WINDOW</div>
            <ContextUsage used={24891} total={200000} label="Input tokens" />
            <ContextUsage used={3412} total={32000} label="Output tokens" />
            <ContextUsage used={7} total={50} label="Tool calls" />
          </div>

          {/* Model selector */}
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">MODEL</div>
            <ModelSelector models={models} selected="opus-4.6" />
          </div>
        </div>

        {/* Right panel — Runtime data */}
        <div className="col-span-8 space-y-4">
          {/* Token stream */}
          <div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">TOKEN STREAM</div>
            <TokenStream tokens={tokens} isStreaming speed={60} />
          </div>

          {/* Tool invocations */}
          <div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">TOOL INVOCATIONS</div>
            <div className="space-y-2">
              {toolCalls.map((tc, i) => (
                <ToolInvocation key={i} {...tc} />
              ))}
            </div>
          </div>

          {/* Prompt editor */}
          <PromptEditor
            value="Fix the performance issue in Dashboard.tsx — the component re-renders infinitely due to a missing useEffect dependency array."
            variables={["file_path", "task_type"]}
          />

          {/* Token throughput chart */}
          <MetricChart title="Token throughput (tok/s)" data={tokenRateData} color="#06b6d4" height={100} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

function AgentLoading() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center gap-4">
        <AgentAvatar name="Agent" status="thinking" size="lg" />
        <div>
          <h1 className="text-lg text-cyan-400">Agent Runtime Console</h1>
          <div className="text-xs text-cyan-500/50 mt-0.5">Initializing session...</div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-4">
          <BrainActivity regions={brainRegions.map((r) => ({ ...r, activity: 0 }))} />
          <StepTracker steps={steps.map((s) => ({ ...s, status: "pending" as const }))} />
          <ContextUsage used={0} total={200000} label="Awaiting input" />
        </div>
        <div className="col-span-8">
          <TokenStream tokens={[]} />
          <div className="mt-4">
            <PromptEditor placeholder="Waiting for task assignment..." variables={[]} />
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
  title: "Pages/Agent Runtime Console",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <AgentRuntimeConsole /> };
export const Loading: Story = { render: () => <AgentLoading /> };
