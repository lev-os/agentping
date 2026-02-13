import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CanvasRenderer } from "../../components/migrations/canvas-renderer";
import { PolymorphPlayground } from "../../components/migrations/polymorph-playground";
import { KanbanBoard, type KanbanColumn } from "../../components/migrations/kanban-board";
import { MindMap, type MindMapNode } from "../../components/migrations/mind-map";
import { OrgChart, type OrgNode } from "../../components/migrations/org-chart";
import { NetworkGraph, type NetworkNode, type NetworkLink } from "../../components/migrations/network-graph";
import { DependencyGraph, type DependencyNode } from "../../components/migrations/dependency-graph";
import { SchemaGraph, type SchemaNode, type SchemaRelation } from "../../components/migrations/schema-graph";
import { GeoMap, type MapMarker } from "../../components/migrations/geo-map";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    items: [
      { id: "k1", title: "Implement OAuth2 flow", description: "Add Google + GitHub SSO" },
      { id: "k2", title: "Design agent dashboard", description: "Wireframes for v2 UI" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      { id: "k3", title: "Fix CVE-2026-1842", description: "Patch lodash.merge vulnerability" },
      { id: "k4", title: "Agent routing refactor", description: "Extract router from flowmind" },
    ],
  },
  {
    id: "review",
    title: "Review",
    items: [
      { id: "k5", title: "Add WebSocket reconnect", description: "Exponential backoff strategy" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      { id: "k6", title: "Migrate UI components", description: "416 components to @kingly/ui" },
      { id: "k7", title: "Set up Storybook", description: "327 stories with QA reports" },
    ],
  },
];

const MIND_MAP: MindMapNode = {
  id: "root",
  label: "Leviathan Runtime",
  children: [
    {
      id: "core",
      label: "Core",
      children: [
        { id: "flowmind", label: "FlowMind" },
        { id: "events", label: "Events" },
        { id: "config", label: "Config" },
        { id: "harness", label: "Harness" },
      ],
    },
    {
      id: "plugins",
      label: "Plugins",
      children: [
        { id: "platforms", label: "Platforms" },
        { id: "timetravel", label: "TimeTravel" },
        { id: "codex", label: "Codex" },
      ],
    },
    {
      id: "community",
      label: "Community",
      children: [
        { id: "agentping", label: "AgentPing" },
        { id: "portable", label: "lev-portable" },
      ],
    },
  ],
};

const ORG_TREE: OrgNode = {
  id: "o1",
  name: "Director",
  role: "System Orchestrator",
  children: [
    {
      id: "o2",
      name: "Cipher",
      role: "Security Lead",
      children: [
        { id: "o5", name: "Guard-A", role: "Perimeter" },
        { id: "o6", name: "Guard-B", role: "Internal" },
      ],
    },
    {
      id: "o3",
      name: "Aegis",
      role: "DevOps Lead",
      children: [
        { id: "o7", name: "Builder-1", role: "CI/CD" },
        { id: "o8", name: "Builder-2", role: "Infra" },
      ],
    },
    { id: "o4", name: "Nova", role: "Research Lead" },
  ],
};

const NETWORK_NODES: NetworkNode[] = [
  { id: "n1", label: "Gateway", x: 300, y: 50, type: "hub" },
  { id: "n2", label: "Auth", x: 150, y: 150, type: "primary" },
  { id: "n3", label: "Router", x: 450, y: 150, type: "primary" },
  { id: "n4", label: "DB-Primary", x: 100, y: 280, type: "secondary" },
  { id: "n5", label: "DB-Replica", x: 200, y: 320, type: "secondary" },
  { id: "n6", label: "Cache", x: 400, y: 250, type: "secondary" },
  { id: "n7", label: "Worker-1", x: 500, y: 300, type: "primary" },
  { id: "n8", label: "Worker-2", x: 350, y: 350, type: "primary" },
];

const NETWORK_LINKS: NetworkLink[] = [
  { source: "n1", target: "n2" },
  { source: "n1", target: "n3" },
  { source: "n2", target: "n4" },
  { source: "n4", target: "n5" },
  { source: "n3", target: "n6" },
  { source: "n3", target: "n7" },
  { source: "n3", target: "n8" },
  { source: "n7", target: "n6" },
  { source: "n8", target: "n4" },
];

const DEP_NODES: DependencyNode[] = [
  { id: "d1", label: "@kingly/ui", deps: [], status: "ok" },
  { id: "d2", label: "@agentping/core", deps: ["@kingly/ui"], status: "ok" },
  { id: "d3", label: "@agentping/web-ui", deps: ["@kingly/ui", "@agentping/core"], status: "warning" },
  { id: "d4", label: "@agentping/studio", deps: ["@kingly/ui", "@agentping/core"], status: "ok" },
  { id: "d5", label: "@agentping/daemon", deps: ["@agentping/core"], status: "ok" },
  { id: "d6", label: "@agentping/canvas", deps: ["@kingly/ui"], status: "error" },
];

const SCHEMA_NODES: SchemaNode[] = [
  { id: "s1", name: "Agent", fields: [{ name: "id", type: "uuid" }, { name: "name", type: "text" }, { name: "model", type: "text" }], x: 100, y: 80 },
  { id: "s2", name: "Task", fields: [{ name: "id", type: "uuid" }, { name: "title", type: "text" }, { name: "agent_id", type: "uuid" }], x: 350, y: 80 },
  { id: "s3", name: "Session", fields: [{ name: "id", type: "uuid" }, { name: "started_at", type: "timestamp" }], x: 100, y: 250 },
  { id: "s4", name: "Event", fields: [{ name: "id", type: "uuid" }, { name: "type", type: "text" }, { name: "session_id", type: "uuid" }], x: 350, y: 250 },
];

const SCHEMA_RELATIONS: SchemaRelation[] = [
  { from: "s1", to: "s2", type: "one-to-many" },
  { from: "s1", to: "s3", type: "one-to-many" },
  { from: "s3", to: "s4", type: "one-to-many" },
  { from: "s2", to: "s4", type: "one-to-many" },
];

const MAP_MARKERS: MapMarker[] = [
  { id: "m1", lat: 37.77, lng: -122.42, label: "SF-Primary", type: "active" },
  { id: "m2", lat: 40.71, lng: -74.01, label: "NYC-Backup", type: "default" },
  { id: "m3", lat: 51.51, lng: -0.13, label: "LDN-Edge", type: "default" },
  { id: "m4", lat: 35.68, lng: 139.69, label: "TKY-Edge", type: "alert" },
  { id: "m5", lat: -33.87, lng: 151.21, label: "SYD-Mirror", type: "default" },
];

const TABS = ["Kanban", "Mind Map", "Org Chart", "Network", "Dependencies", "Schema", "Geo Map", "Canvas", "Polymorph"];

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function CanvasScenePlayground() {
  const [activeTab, setActiveTab] = useState("Kanban");

  const renderContent = () => {
    switch (activeTab) {
      case "Kanban":
        return <KanbanBoard columns={KANBAN_COLUMNS} />;
      case "Mind Map":
        return <MindMap data={MIND_MAP} />;
      case "Org Chart":
        return (
          <div className="flex justify-center py-8">
            <OrgChart data={ORG_TREE} />
          </div>
        );
      case "Network":
        return <NetworkGraph nodes={NETWORK_NODES} links={NETWORK_LINKS} width={600} height={400} />;
      case "Dependencies":
        return <DependencyGraph nodes={DEP_NODES} />;
      case "Schema":
        return <SchemaGraph nodes={SCHEMA_NODES} relations={SCHEMA_RELATIONS} width={500} height={350} />;
      case "Geo Map":
        return <GeoMap markers={MAP_MARKERS} width={600} height={350} />;
      case "Canvas":
        return (
          <CanvasRenderer
            payload={{
              type: "canvas_interaction",
              action: "render",
              componentType: "sofia-widget",
              props: { provider: "sofia", widgetId: "task-board", variant: "kanban" },
              instruction: "Render the agent task board",
            }}
            onRespond={() => {}}
          />
        );
      case "Polymorph":
        return <PolymorphPlayground />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 bg-black/95 px-6 py-3">
        <h1 className="text-sm text-cyan-400 uppercase tracking-widest">Canvas & Scene Playground</h1>
        <p className="text-[10px] text-cyan-500/40 mt-0.5">Interactive visualization components — {TABS.length} modes</p>
      </div>

      <div className="grid grid-cols-[1fr_280px] h-[calc(100vh-52px)]">
        {/* Main canvas area */}
        <div className="flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-cyan-500/10 bg-black/95 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-cyan-300 border-cyan-400"
                    : "text-cyan-500/40 border-transparent hover:text-cyan-300 hover:border-cyan-500/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Visualization area */}
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </div>

        {/* Right — Controls panel */}
        <aside className="border-l border-cyan-500/10 bg-black/95 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Active View</div>
            <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-3">
              <div className="text-xs text-cyan-300">{activeTab}</div>
              <div className="text-[10px] text-cyan-500/40 mt-1">
                {activeTab === "Kanban" && `${KANBAN_COLUMNS.length} columns, ${KANBAN_COLUMNS.reduce((a, c) => a + c.items.length, 0)} items`}
                {activeTab === "Network" && `${NETWORK_NODES.length} nodes, ${NETWORK_LINKS.length} links`}
                {activeTab === "Dependencies" && `${DEP_NODES.length} packages`}
                {activeTab === "Schema" && `${SCHEMA_NODES.length} tables, ${SCHEMA_RELATIONS.length} relations`}
                {activeTab === "Geo Map" && `${MAP_MARKERS.length} markers`}
                {activeTab === "Mind Map" && "Hierarchical tree view"}
                {activeTab === "Org Chart" && "Agent hierarchy"}
                {activeTab === "Canvas" && "Sofia widget renderer"}
                {activeTab === "Polymorph" && "Engine playground"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Node Status</div>
            <div className="space-y-2">
              {DEP_NODES.map((n) => (
                <div key={n.id} className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 truncate">{n.label}</span>
                  <span className={`text-[10px] ${
                    n.status === "ok" ? "text-green-400" : n.status === "warning" ? "text-amber-400" : "text-red-400"
                  }`}>
                    {n.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Deployment Map</div>
            <GeoMap markers={MAP_MARKERS} width={240} height={140} />
          </div>

          <div>
            <div className="text-[10px] text-cyan-500/40 uppercase tracking-widest mb-3">Quick Nav</div>
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                    activeTab === tab ? "bg-cyan-500/10 text-cyan-300" : "text-cyan-500/40 hover:text-cyan-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Canvas & Scene Playground",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <CanvasScenePlayground />,
};
