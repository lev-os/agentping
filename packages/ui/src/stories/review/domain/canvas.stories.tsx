import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CanvasRenderer } from "../../../components/migrations/canvas-renderer";
import { ConnectionStatus } from "../../../components/migrations/connection-status";
import { KanbanBoard } from "../../../components/migrations/kanban-board";
import { MarkdownCard } from "../../../components/migrations/markdown-card";
import { PolymorphPlayground } from "../../../components/migrations/polymorph-playground";
import { TodoList } from "../../../components/migrations/todo-list";
import { MindMap } from "../../../components/migrations/mind-map";
import { OrgChart } from "../../../components/migrations/org-chart";
import { NetworkGraph } from "../../../components/migrations/network-graph";
import { DependencyGraph } from "../../../components/migrations/dependency-graph";
import { GraphView } from "../../../components/migrations/graph-view";

const meta: Meta = {
  title: "Review/Domain/Canvas & Visual",
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

const MOCK_KANBAN = [
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: "1", title: "Design auth flow", description: "Implement OAuth2 login" },
      { id: "2", title: "Setup CI pipeline" },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    items: [
      { id: "3", title: "API endpoints", description: "REST API for agents" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      { id: "4", title: "Database schema" },
      { id: "5", title: "Project scaffolding" },
    ],
  },
];

const MOCK_MIND_MAP = {
  id: "root",
  label: "Agent Platform",
  children: [
    {
      id: "core",
      label: "Core",
      children: [
        { id: "runtime", label: "Runtime" },
        { id: "config", label: "Config" },
        { id: "events", label: "Events" },
      ],
    },
    {
      id: "plugins",
      label: "Plugins",
      children: [
        { id: "codex", label: "Codex" },
        { id: "timetravel", label: "TimeTravel" },
      ],
    },
    {
      id: "community",
      label: "Community",
      children: [
        { id: "agentping", label: "AgentPing" },
        { id: "portable", label: "Portable" },
      ],
    },
  ],
};

const MOCK_ORG = {
  id: "ceo",
  name: "Alice",
  role: "CEO",
  children: [
    {
      id: "cto",
      name: "Bob",
      role: "CTO",
      children: [
        { id: "lead1", name: "Charlie", role: "Tech Lead" },
        { id: "lead2", name: "Diana", role: "Tech Lead" },
      ],
    },
    {
      id: "cpo",
      name: "Eve",
      role: "CPO",
      children: [{ id: "pm1", name: "Frank", role: "Product Manager" }],
    },
  ],
};

const MOCK_NETWORK_NODES = [
  { id: "hub", label: "Hub", x: 100, y: 100, type: "hub" as const },
  { id: "a", label: "Node A", x: 30, y: 30, type: "primary" as const },
  { id: "b", label: "Node B", x: 170, y: 30, type: "primary" as const },
  { id: "c", label: "Node C", x: 30, y: 170, type: "secondary" as const },
  { id: "d", label: "Node D", x: 170, y: 170, type: "secondary" as const },
];

const MOCK_NETWORK_LINKS = [
  { source: "hub", target: "a" },
  { source: "hub", target: "b" },
  { source: "hub", target: "c" },
  { source: "hub", target: "d" },
  { source: "a", target: "b" },
];

const MOCK_DEP_NODES = [
  { id: "core", label: "@lev-os/core", deps: [], status: "ok" as const },
  { id: "config", label: "@lev-os/config", deps: ["core"], status: "ok" as const },
  { id: "events", label: "@lev-os/events", deps: ["core"], status: "ok" as const },
  { id: "flowmind", label: "@lev-os/flowmind", deps: ["core", "events"], status: "warning" as const },
  { id: "poly", label: "@lev-os/poly", deps: ["core", "config"], status: "error" as const },
];

export const AllComponents: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-lg font-mono text-cyan-400 uppercase tracking-wider">
            Canvas & Visual Components
          </h1>
          <p className="text-xs text-cyan-500/40 mt-1">
            11 canvas, graph, and visual structure components
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="CanvasRenderer (selection mode)">
            <CanvasRenderer
              payload={{
                type: "canvas_interaction",
                action: "selection",
                instruction: "Select a component to inspect",
              }}
              onRespond={() => {}}
            />
          </Card>

          <Card title="ConnectionStatus">
            <div className="flex gap-6">
              <ConnectionStatus connected={true} />
              <ConnectionStatus connected={false} />
            </div>
          </Card>

          <Card title="KanbanBoard">
            <KanbanBoard columns={MOCK_KANBAN} />
          </Card>

          <Card title="MarkdownCard">
            <MarkdownCard
              title="Release Notes"
              content={"## v2.1.0\n\n- Added agent orchestration\n- Fixed memory leak in event loop\n- Updated dependency graph renderer"}
            />
          </Card>

          <Card title="PolymorphPlayground">
            <PolymorphPlayground />
          </Card>

          <Card title="TodoList">
            <TodoList
              title="Sprint Tasks"
              items={[
                { id: "1", text: "Implement auth flow", checked: true, priority: "high" },
                { id: "2", text: "Write integration tests", checked: false, priority: "medium" },
                { id: "3", text: "Deploy to staging", checked: false, priority: "low" },
                { id: "4", text: "Update documentation", checked: true },
              ]}
              onRespond={() => {}}
            />
          </Card>

          <Card title="MindMap">
            <MindMap data={MOCK_MIND_MAP} />
          </Card>

          <Card title="OrgChart">
            <OrgChart data={MOCK_ORG} />
          </Card>

          <Card title="NetworkGraph">
            <NetworkGraph
              nodes={MOCK_NETWORK_NODES}
              links={MOCK_NETWORK_LINKS}
              width={200}
              height={200}
            />
          </Card>

          <Card title="DependencyGraph">
            <DependencyGraph nodes={MOCK_DEP_NODES} />
          </Card>

          <Card title="GraphView">
            <GraphView
              id="demo-graph"
              title="Agent Dependencies"
              nodes={[
                { id: "n1", label: "Core" },
                { id: "n2", label: "Config" },
                { id: "n3", label: "Events" },
              ]}
              edges={[
                { source: "n1", target: "n2" },
                { source: "n1", target: "n3" },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  ),
};
