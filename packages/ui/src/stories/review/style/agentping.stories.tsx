import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  BadgeWebUiRaw,
  ButtonWebUiRaw,
  CodeDiffViewerWebUiRaw,
  ContextMenuWebUiRaw,
  EmptyStateWebUiRaw,
  IconButtonWebUiRaw,
  InputWebUiRaw,
  SearchInputWebUiRaw,
  SpinnerWebUiRaw,
  TimelineWebUiRaw,
  LogViewerWebUiRaw,
} from "../../../components/migrations";

const meta: Meta = {
  title: "Review/Style/AgentPing (WebUI)",
  parameters: { layout: "fullscreen" },
};
export default meta;

/* ---------------------------------------------------------------------------
 * Shared realistic prop fixtures
 * --------------------------------------------------------------------------- */

const contextMenuActions = [
  { id: "copy", label: "Copy to clipboard", shortcut: "Cmd+C" },
  { id: "edit", label: "Edit configuration" },
  { id: "export", label: "Export as JSON", shortcut: "Cmd+E" },
  { id: "delete", label: "Delete permanently", danger: true },
  { id: "disabled", label: "Unavailable action", disabled: true },
];

const timelineItems = [
  { id: "1", title: "Agent spawned", detail: "PID 4821 initialized", time: "00:00.00", status: "done" as const },
  { id: "2", title: "Model loaded", detail: "claude-opus-4-6 via API", time: "00:01.23", status: "done" as const },
  { id: "3", title: "Task executing", detail: "Processing user prompt", time: "00:02.45", status: "active" as const },
  { id: "4", title: "Awaiting review", time: "—", status: "queued" as const },
];

const logEntries = [
  { id: "1", timestamp: "14:32:01", level: "info" as const, message: "Agent session started", source: "daemon" },
  { id: "2", timestamp: "14:32:02", level: "debug" as const, message: "Loading model weights from cache", source: "runtime" },
  { id: "3", timestamp: "14:32:05", level: "warn" as const, message: "Token budget at 78% capacity", source: "router" },
  { id: "4", timestamp: "14:32:08", level: "error" as const, message: "Connection timeout to upstream provider", source: "adapter" },
  { id: "5", timestamp: "14:32:10", level: "info" as const, message: "Retry succeeded on attempt 2", source: "adapter" },
];

const diffBefore = `function run(task) {
  const result = execute(task);
  return result;
}`;

const diffAfter = `async function run(task) {
  const result = await execute(task);
  logger.info("complete");
  return result;
}`;

/* ---------------------------------------------------------------------------
 * Story
 * --------------------------------------------------------------------------- */

export const AllFamilies: StoryObj = {
  render: () => (
    <div className="p-8 space-y-6 bg-black/90 min-h-screen font-mono">
      <div className="mb-8">
        <h1 className="text-xl text-amber-400 tracking-wider uppercase">
          AgentPing (WebUI) Variants
        </h1>
        <p className="text-sm text-amber-500/60 mt-1">
          11 conflict families &middot; WebUI raw implementations
        </p>
        <div className="h-px bg-amber-500/20 mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Badge */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Badge</div>
          <div className="flex flex-wrap gap-2">
            <BadgeWebUiRaw label="NEUTRAL" tone="neutral" />
            <BadgeWebUiRaw label="SUCCESS" tone="success" />
            <BadgeWebUiRaw label="WARNING" tone="warning" />
            <BadgeWebUiRaw label="DANGER" tone="danger" />
            <BadgeWebUiRaw label="SUBTLE" tone="neutral" subtle />
          </div>
        </div>

        {/* Button */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Button</div>
          <div className="flex flex-wrap gap-2">
            <ButtonWebUiRaw label="Primary" tone="primary" size="sm" />
            <ButtonWebUiRaw label="Secondary" tone="secondary" size="sm" />
            <ButtonWebUiRaw label="Ghost" tone="ghost" size="sm" />
            <ButtonWebUiRaw label="Danger" tone="danger" size="sm" />
          </div>
        </div>

        {/* IconButton */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">IconButton</div>
          <div className="flex items-center gap-3">
            <IconButtonWebUiRaw label="Neutral" tone="neutral" size="sm" />
            <IconButtonWebUiRaw label="Primary" tone="primary" size="md" />
            <IconButtonWebUiRaw label="Danger" tone="danger" size="lg" />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Input</div>
          <InputWebUiRaw label="Agent Name" placeholder="Enter agent identifier..." hint="Alphanumeric only" />
          <InputWebUiRaw label="Endpoint" placeholder="https://..." status="error" hint="Invalid URL format" />
        </div>

        {/* SearchInput */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">SearchInput</div>
          <SearchInputWebUiRaw placeholder="Search agents..." />
          <SearchInputWebUiRaw defaultQuery="opus-4" placeholder="Filter logs..." />
          <SearchInputWebUiRaw loading placeholder="Indexing..." />
        </div>

        {/* Spinner */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Spinner</div>
          <div className="flex flex-col gap-3">
            <SpinnerWebUiRaw size="sm" label="Connecting" />
            <SpinnerWebUiRaw size="md" label="Loading model" />
            <SpinnerWebUiRaw size="lg" label="Processing batch" />
          </div>
        </div>

        {/* EmptyState */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">EmptyState</div>
          <EmptyStateWebUiRaw
            title="No agents running"
            description="Start an agent to see activity here."
            ctaLabel="Launch Agent"
          />
        </div>

        {/* ContextMenu */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">ContextMenu</div>
          <ContextMenuWebUiRaw title="Agent Actions" actions={contextMenuActions} />
        </div>

        {/* Timeline */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Timeline</div>
          <TimelineWebUiRaw items={timelineItems} />
        </div>

        {/* CodeDiffViewer — full width */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3 md:col-span-2 lg:col-span-2">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">CodeDiffViewer</div>
          <CodeDiffViewerWebUiRaw title="router.ts" before={diffBefore} after={diffAfter} />
        </div>

        {/* LogViewer — full width */}
        <div className="p-4 border border-amber-500/20 rounded-lg bg-black/40 space-y-3 lg:col-span-3 md:col-span-2">
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">LogViewer</div>
          <LogViewerWebUiRaw entries={logEntries} maxHeight={200} />
        </div>
      </div>
    </div>
  ),
};
