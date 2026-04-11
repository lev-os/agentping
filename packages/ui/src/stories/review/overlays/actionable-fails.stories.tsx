// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { CandleStickChart } from "../../../components/migrations/candlestick-chart";
import { CrudDetailPage } from "../../../components/migrations/crud-detail-page";
import { CrudListPage } from "../../../components/migrations/crud-list-page";
import { FadeInOut, AnimatedList } from "../../../components/migrations/animations";
import { DmCreateDashboardModal } from "../../../components/migrations/dm-create-dashboard-modal";
import { DmLogViewer } from "../../../components/migrations/dm-log-viewer";
import { CanvasRenderer } from "../../../components/migrations/canvas-renderer";
import { TodoList } from "../../../components/migrations/todo-list";
import { MindMap } from "../../../components/migrations/mind-map";
import { DependencyGraph } from "../../../components/migrations/dependency-graph";
import { StatusPieChart } from "../../../components/migrations/status-pie-chart";
import { AdvancedDataGrid } from "../../../components/migrations/advanced-data-grid";

const meta: Meta = {
  title: "Review/Overlays/Actionable Failures",
};
export default meta;

type Story = StoryObj;

interface FailCardProps {
  name: string;
  failure: string;
  children: React.ReactNode;
}

function FailCard({ name, failure, children }: FailCardProps) {
  return (
    <div className="p-4 border border-red-500/20 rounded-lg bg-black/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-cyan-500/50 font-mono">{name}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
          FAIL
        </span>
      </div>
      <div className="text-[9px] text-red-400/60 mb-3 font-mono">
        Failure: {failure}
      </div>
      {children}
    </div>
  );
}

const CRUD_CONFIG = {
  entity: { singular: "Agent", plural: "Agents", icon: "bot" },
  fields: [
    { key: "name" as const, label: "Name", type: "text" as const, required: true },
    { key: "status" as const, label: "Status", type: "text" as const },
  ],
  primaryKey: "id" as const,
};

export const AllFailures: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-red-500/20 pb-4">
          <h1 className="text-lg font-mono text-red-400 uppercase tracking-wider">
            Actionable Failures
          </h1>
          <p className="text-xs text-red-400/40 mt-1">
            12 components that had actionable failures in Pass 3 QA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FailCard
            name="CandlestickChart"
            failure="Empty data array causes divide-by-zero in scale calculation"
          >
            <CandleStickChart
              title="BTC/USD"
              data={[
                { time: "09:00", open: 42000, high: 42500, low: 41800, close: 42300, volume: 1200 },
                { time: "10:00", open: 42300, high: 42800, low: 42100, close: 42600, volume: 980 },
                { time: "11:00", open: 42600, high: 42700, low: 42200, close: 42400, volume: 1100 },
              ]}
            />
          </FailCard>

          <FailCard
            name="CrudListPage"
            failure="Missing CrudProvider context crashes on mount"
          >
            <CrudListPage
              config={CRUD_CONFIG}
              initialItems={[
                { id: "1", name: "Alpha", status: "online" },
                { id: "2", name: "Beta", status: "idle" },
              ]}
            />
          </FailCard>

          <FailCard
            name="CrudDetailPage"
            failure="Missing CrudProvider context crashes on mount"
          >
            <CrudDetailPage
              config={CRUD_CONFIG}
              itemId="1"
              initialItem={{ id: "1", name: "Alpha", status: "online" }}
            />
          </FailCard>

          <FailCard
            name="FadeInOut"
            failure="Missing children prop causes empty render"
          >
            <FadeInOut visible={true}>
              <div className="text-xs text-cyan-400 p-2 border border-cyan-500/20 rounded">
                Animated content visible
              </div>
            </FadeInOut>
          </FailCard>

          <FailCard
            name="AnimatedList"
            failure="Empty items array with no fallback"
          >
            <AnimatedList>
              <div className="text-xs text-gray-400 p-1">Item 1</div>
              <div className="text-xs text-gray-400 p-1">Item 2</div>
              <div className="text-xs text-gray-400 p-1">Item 3</div>
            </AnimatedList>
          </FailCard>

          <FailCard
            name="DmCreateDashboardModal"
            failure="Missing onClose/onSubmit handlers crash form"
          >
            <DmCreateDashboardModal
              onClose={() => {}}
              onSubmit={async () => {}}
            />
          </FailCard>

          <FailCard
            name="DmLogViewer"
            failure="Missing dashboardId prop causes undefined in filter"
          >
            <DmLogViewer
              dashboardId="test-app"
              logs={[
                { dashboardId: "test-app", line: "[INFO] Starting...", stream: "stdout", timestamp: new Date().toISOString() },
                { dashboardId: "test-app", line: "[ERROR] Connection refused", stream: "stderr", timestamp: new Date().toISOString() },
              ]}
            />
          </FailCard>

          <FailCard
            name="CanvasRenderer"
            failure="Invalid payload type causes unhandled branch"
          >
            <CanvasRenderer
              payload={{
                type: "canvas_interaction",
                action: "selection",
                instruction: "Select component to inspect",
              }}
              onRespond={() => {}}
            />
          </FailCard>

          <FailCard
            name="TodoList"
            failure="Missing onRespond handler crashes toggle action"
          >
            <TodoList
              title="Test Tasks"
              items={[
                { id: "1", text: "Fix failing test", checked: false, priority: "high" },
                { id: "2", text: "Update docs", checked: true },
              ]}
              onRespond={() => {}}
            />
          </FailCard>

          <FailCard
            name="MindMap"
            failure="Deeply nested data causes stack overflow in recursive render"
          >
            <MindMap
              data={{
                id: "root",
                label: "Platform",
                children: [
                  { id: "a", label: "Core", children: [{ id: "a1", label: "Runtime" }] },
                  { id: "b", label: "Plugins" },
                ],
              }}
            />
          </FailCard>

          <FailCard
            name="DependencyGraph"
            failure="Circular dependency reference causes infinite loop"
          >
            <DependencyGraph
              nodes={[
                { id: "a", label: "Package A", deps: [], status: "ok" },
                { id: "b", label: "Package B", deps: ["a"], status: "warning" },
                { id: "c", label: "Package C", deps: ["b"], status: "error" },
              ]}
            />
          </FailCard>

          <FailCard
            name="StatusPieChart"
            failure="Studio-only recharts dependency, CSS conic-gradient fallback"
          >
            <StatusPieChart
              data={[
                { label: "Online", value: 8, color: "#00e5ff" },
                { label: "Failed", value: 2, color: "#ff2a6d" },
                { label: "Stopped", value: 3, color: "#666" },
              ]}
            />
          </FailCard>

          <FailCard
            name="AdvancedDataGrid"
            failure="Missing columns config crashes header render"
          >
            <AdvancedDataGrid
              title="Agents"
              columns={[
                { key: "name", label: "Name" },
                { key: "status", label: "Status" },
              ]}
              data={[
                { name: "Alpha", status: "online" },
                { name: "Beta", status: "offline" },
              ]}
            />
          </FailCard>
        </div>
      </div>
    </div>
  ),
};
