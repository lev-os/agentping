import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  BadgeCandidate,
  ButtonCandidate,
  CodeDiffViewerCandidate,
  ContextMenuCandidate,
  EmptyStateCandidate,
  IconButtonCandidate,
  InputCandidate,
  SearchInputCandidate,
  SpinnerCandidate,
  TimelineCandidate,
  LogViewerCandidate,
} from "../../../components/catalog";

const meta: Meta = {
  title: "Review/Style/Sophia (Candidate)",
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
        <h1 className="text-xl text-cyan-400 tracking-wider uppercase">
          Sophia (Candidate) Variants
        </h1>
        <p className="text-sm text-cyan-500/60 mt-1">
          11 conflict families &middot; Candidate / merged implementations
        </p>
        <div className="h-px bg-cyan-500/20 mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Badge */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">Badge</div>
          <div className="flex flex-wrap gap-2">
            <BadgeCandidate label="NEUTRAL" tone="neutral" />
            <BadgeCandidate label="SUCCESS" tone="success" />
            <BadgeCandidate label="WARNING" tone="warning" />
            <BadgeCandidate label="DANGER" tone="danger" />
            <BadgeCandidate label="SUBTLE" tone="neutral" subtle />
          </div>
        </div>

        {/* Button */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">Button</div>
          <div className="flex flex-wrap gap-2">
            <ButtonCandidate label="Primary" tone="primary" size="sm" />
            <ButtonCandidate label="Secondary" tone="secondary" size="sm" />
            <ButtonCandidate label="Ghost" tone="ghost" size="sm" />
            <ButtonCandidate label="Danger" tone="danger" size="sm" />
          </div>
        </div>

        {/* IconButton */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">IconButton</div>
          <div className="flex items-center gap-3">
            <IconButtonCandidate label="Neutral" tone="neutral" size="sm" />
            <IconButtonCandidate label="Primary" tone="primary" size="md" />
            <IconButtonCandidate label="Danger" tone="danger" size="lg" />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">Input</div>
          <InputCandidate label="Agent Name" placeholder="Enter agent identifier..." hint="Alphanumeric only" />
          <InputCandidate label="Endpoint" placeholder="https://..." status="error" hint="Invalid URL format" />
        </div>

        {/* SearchInput */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">SearchInput</div>
          <SearchInputCandidate placeholder="Search agents..." />
          <SearchInputCandidate defaultQuery="opus-4" placeholder="Filter logs..." />
          <SearchInputCandidate loading placeholder="Indexing..." />
        </div>

        {/* Spinner */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">Spinner</div>
          <div className="flex flex-col gap-3">
            <SpinnerCandidate size="sm" label="Connecting" />
            <SpinnerCandidate size="md" label="Loading model" />
            <SpinnerCandidate size="lg" label="Processing batch" />
          </div>
        </div>

        {/* EmptyState */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">EmptyState</div>
          <EmptyStateCandidate
            title="No agents running"
            description="Start an agent to see activity here."
            ctaLabel="Launch Agent"
          />
        </div>

        {/* ContextMenu */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">ContextMenu</div>
          <ContextMenuCandidate title="Agent Actions" actions={contextMenuActions} />
        </div>

        {/* Timeline */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">Timeline</div>
          <TimelineCandidate items={timelineItems} />
        </div>

        {/* CodeDiffViewer — full width */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3 md:col-span-2 lg:col-span-2">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">CodeDiffViewer</div>
          <CodeDiffViewerCandidate title="router.ts" before={diffBefore} after={diffAfter} />
        </div>

        {/* LogViewer — DEFERRED: Candidate has different props */}
        <div className="p-4 border border-cyan-500/20 rounded-lg bg-black/40 space-y-3 lg:col-span-3 md:col-span-2">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider">LogViewer (Deferred)</div>
          <LogViewerCandidate
            reason="Deferred: evaluate virtualization and ANSI rendering parity before merge."
            ticket="MIG-LOGVIEWER"
          />
        </div>
      </div>
    </div>
  ),
};
