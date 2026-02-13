import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { DataTable } from "../../components/migrations/data-table";
import { JsonEditor } from "../../components/migrations/json-editor";
import { CsvViewer } from "../../components/migrations/csv-viewer";
import { RegexTester } from "../../components/migrations/regex-tester";
import { TreeBrowser } from "../../components/migrations/tree-browser";
import { VectorCluster } from "../../components/migrations/vector-cluster";
import { SqlResultTable } from "../../components/migrations/sql-result-table";
import { JsonTreeViewer } from "../../components/migrations/json-tree-viewer";
import { JsonDiff } from "../../components/migrations/json-diff";
import { StatusIndicator } from "../../components/migrations/status-indicator";
import { StatsGrid } from "../../components/migrations/stats-grid";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const fileTree = [
  {
    id: "src", label: "src", type: "folder" as const, children: [
      {
        id: "handlers", label: "handlers", type: "folder" as const, children: [
          { id: "agent-create", label: "agent-create.ts", type: "file" as const },
          { id: "agent-list", label: "agent-list.ts", type: "file" as const },
          { id: "session", label: "session.ts", type: "file" as const },
        ],
      },
      {
        id: "services", label: "services", type: "folder" as const, children: [
          { id: "knowledge", label: "knowledge-client.ts", type: "file" as const },
          { id: "embedder", label: "embedder.ts", type: "file" as const },
          { id: "cache", label: "cache.ts", type: "file" as const },
        ],
      },
      { id: "router", label: "router.ts", type: "file" as const },
      { id: "config", label: "config.ts", type: "file" as const },
    ],
  },
  {
    id: "data", label: "data", type: "folder" as const, children: [
      { id: "agents-json", label: "agents.json", type: "file" as const },
      { id: "sessions-csv", label: "sessions.csv", type: "file" as const },
      { id: "embeddings", label: "embeddings.bin", type: "file" as const },
    ],
  },
  { id: "package", label: "package.json", type: "file" as const },
  { id: "tsconfig", label: "tsconfig.json", type: "file" as const },
];

const agentData = [
  { id: "agt-7f3a", name: "Opus Agent", model: "opus-4.6", status: "active", tokens_used: 142891, created: "2026-02-12" },
  { id: "agt-2b1c", name: "Research Bot", model: "sonnet-4.5", status: "active", tokens_used: 89234, created: "2026-02-11" },
  { id: "agt-9d4e", name: "Code Reviewer", model: "opus-4.6", status: "idle", tokens_used: 234112, created: "2026-02-10" },
  { id: "agt-1a8f", name: "QA Validator", model: "haiku-4.5", status: "active", tokens_used: 12445, created: "2026-02-12" },
  { id: "agt-5c2d", name: "Deploy Agent", model: "sonnet-4.5", status: "offline", tokens_used: 67823, created: "2026-02-09" },
];

const tableColumns = [
  { key: "id" as const, header: "ID", sortable: true, width: "120px" },
  { key: "name" as const, header: "Name", sortable: true },
  { key: "model" as const, header: "Model", sortable: true },
  { key: "status" as const, header: "Status", sortable: true },
  { key: "tokens_used" as const, header: "Tokens", sortable: true },
  { key: "created" as const, header: "Created", sortable: true },
];

const sampleJson = {
  agent: {
    id: "agt-7f3a",
    name: "Opus Agent",
    model: { provider: "anthropic", id: "opus-4.6", temperature: 0.7 },
    capabilities: ["code_generation", "file_editing", "web_search"],
    context: { max_tokens: 200000, used: 142891 },
    memory: { type: "vector", dimensions: 1536, entries: 847 },
  },
};

const sqlQuery = `SELECT a.id, a.name, a.model, COUNT(s.id) as sessions,
       SUM(s.tokens_used) as total_tokens
FROM agents a
LEFT JOIN sessions s ON s.agent_id = a.id
WHERE a.status = 'active'
GROUP BY a.id, a.name, a.model
ORDER BY total_tokens DESC
LIMIT 10;`;

const sqlColumns = ["id", "name", "model", "sessions", "total_tokens"];
const sqlRows = [
  ["agt-7f3a", "Opus Agent", "opus-4.6", "23", "142,891"],
  ["agt-9d4e", "Code Reviewer", "opus-4.6", "18", "234,112"],
  ["agt-2b1c", "Research Bot", "sonnet-4.5", "12", "89,234"],
  ["agt-1a8f", "QA Validator", "haiku-4.5", "31", "12,445"],
];

const csvData = [
  ["session_id", "agent", "started", "duration_s", "tokens", "status"],
  ["ses-001", "agt-7f3a", "14:00:12", "142", "3421", "completed"],
  ["ses-002", "agt-2b1c", "14:02:33", "87", "1204", "completed"],
  ["ses-003", "agt-7f3a", "14:05:01", "201", "5612", "completed"],
  ["ses-004", "agt-1a8f", "14:08:44", "34", "891", "running"],
  ["ses-005", "agt-9d4e", "14:10:22", "312", "8901", "completed"],
];

const vectorPoints = [
  { x: 0.2, y: 0.8, label: "agent-create", cluster: 0 },
  { x: 0.3, y: 0.7, label: "agent-list", cluster: 0 },
  { x: 0.25, y: 0.75, label: "agent-update", cluster: 0 },
  { x: 0.7, y: 0.3, label: "session-start", cluster: 1 },
  { x: 0.8, y: 0.2, label: "session-end", cluster: 1 },
  { x: 0.75, y: 0.25, label: "session-resume", cluster: 1 },
  { x: 0.5, y: 0.5, label: "knowledge-query", cluster: 2 },
  { x: 0.4, y: 0.6, label: "embed-text", cluster: 2 },
  { x: 0.6, y: 0.4, label: "similarity-search", cluster: 2 },
  { x: 0.1, y: 0.1, label: "config-load", cluster: 3 },
  { x: 0.15, y: 0.15, label: "config-save", cluster: 3 },
];

const oldConfig = { model: "sonnet-4.5", temperature: 0.5, max_tokens: 100000 };
const newConfig = { model: "opus-4.6", temperature: 0.7, max_tokens: 200000, streaming: true };

const explorerStats = [
  { label: "Tables", value: 14 },
  { label: "Total Rows", value: "1.2M" },
  { label: "Index Size", value: "847 MB" },
  { label: "Active Queries", value: 3 },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function DataExplorerQueryLab() {
  const [activePanel, setActivePanel] = useState<"table" | "json" | "csv" | "sql">("sql");

  const panels = [
    { key: "sql" as const, label: "SQL" },
    { key: "table" as const, label: "Data Table" },
    { key: "json" as const, label: "JSON" },
    { key: "csv" as const, label: "CSV" },
  ];

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/40 text-xs">[DATA]</span>
          <h1 className="text-lg text-cyan-400">Data Explorer & Query Lab</h1>
        </div>
        <div className="flex gap-4">
          <StatusIndicator status="online" label="DB Connected" />
          <StatusIndicator status="online" label="Index Ready" />
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pt-4">
        <StatsGrid stats={explorerStats} columns={4} />
      </div>

      {/* Main layout */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left sidebar — File tree */}
        <div className="col-span-3 space-y-4">
          <div className="border border-cyan-500/20 bg-black/60 rounded-lg">
            <div className="px-4 py-2 border-b border-cyan-500/10">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">EXPLORER</span>
            </div>
            <TreeBrowser nodes={fileTree} />
          </div>

          <RegexTester
            pattern="agt-[a-f0-9]{4}"
            testString="Agent agt-7f3a connected from session ses-001 at 14:00:12"
          />
        </div>

        {/* Center — Query + Results */}
        <div className="col-span-6 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1">
            {panels.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePanel(p.key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-t border border-b-0 transition-colors ${
                  activePanel === p.key
                    ? "border-cyan-500/30 bg-black/60 text-cyan-400"
                    : "border-transparent text-cyan-500/40 hover:text-cyan-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="border border-cyan-500/20 bg-black/40 rounded-b-lg rounded-tr-lg p-4 space-y-4">
            {activePanel === "sql" && (
              <SqlResultTable
                query={sqlQuery}
                columns={sqlColumns}
                rows={sqlRows}
                executionTime="12ms"
              />
            )}
            {activePanel === "table" && (
              <DataTable columns={tableColumns} data={agentData} keyField="id" />
            )}
            {activePanel === "json" && (
              <JsonEditor value={sampleJson} readOnly />
            )}
            {activePanel === "csv" && (
              <CsvViewer data={csvData} hasHeader />
            )}
          </div>
        </div>

        {/* Right panel — Preview */}
        <div className="col-span-3 space-y-4">
          <JsonTreeViewer data={sampleJson} title="OBJECT INSPECTOR" />

          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">EMBEDDING CLUSTERS</div>
            <VectorCluster points={vectorPoints} width={280} height={220} />
          </div>

          <div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">CONFIG DIFF</div>
            <JsonDiff oldJson={oldConfig} newJson={newConfig} />
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
  title: "Pages/Data Explorer & Query Lab",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <DataExplorerQueryLab /> };
