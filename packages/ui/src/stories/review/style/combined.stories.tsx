import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  BadgeStudioRaw,
  BadgeWebUiRaw,
  BadgeCandidate,
  ButtonStudioRaw,
  ButtonWebUiRaw,
  ButtonCandidate,
  CodeDiffViewerStudioRaw,
  CodeDiffViewerWebUiRaw,
  CodeDiffViewerCandidate,
  ContextMenuStudioRaw,
  ContextMenuWebUiRaw,
  ContextMenuCandidate,
  EmptyStateStudioRaw,
  EmptyStateWebUiRaw,
  EmptyStateCandidate,
  IconButtonStudioRaw,
  IconButtonWebUiRaw,
  IconButtonCandidate,
  InputStudioRaw,
  InputWebUiRaw,
  InputCandidate,
  SearchInputStudioRaw,
  SearchInputWebUiRaw,
  SearchInputCandidate,
  SpinnerStudioRaw,
  SpinnerWebUiRaw,
  SpinnerCandidate,
  TimelineStudioRaw,
  TimelineWebUiRaw,
  TimelineCandidate,
  LogViewerStudioRaw,
  LogViewerWebUiRaw,
  LogViewerCandidate,
} from "../../../components/catalog";

const meta: Meta = {
  title: "Review/Style/Combined (3-Lane Compare)",
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
  { id: "4", timestamp: "14:32:08", level: "error" as const, message: "Connection timeout to upstream", source: "adapter" },
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
 * Helpers
 * --------------------------------------------------------------------------- */

function Lane({ variant, color, children }: { variant: string; color: string; children: React.ReactNode }) {
  const borderColor = color === "purple" ? "border-purple-500/20" : color === "amber" ? "border-amber-500/20" : "border-cyan-500/20";
  const textColor = color === "purple" ? "text-purple-400" : color === "amber" ? "text-amber-400" : "text-cyan-400";

  return (
    <div className={`p-4 border ${borderColor} rounded-lg bg-black/40 min-h-[80px]`}>
      <div className={`text-[10px] ${textColor} mb-3 uppercase tracking-wider`}>{variant}</div>
      {children}
    </div>
  );
}

function FamilySection({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm text-cyan-300 uppercase tracking-wider font-mono">{name}</h2>
      <div className="grid grid-cols-3 gap-4">
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Story
 * --------------------------------------------------------------------------- */

export const ThreeLaneCompare: StoryObj = {
  render: () => (
    <div className="p-8 space-y-8 bg-black/90 min-h-screen font-mono">
      <div className="mb-6">
        <h1 className="text-xl text-purple-400 tracking-wider uppercase">
          Combined Style Comparison
        </h1>
        <p className="text-sm text-purple-400/60 mt-1">
          11 conflict families &middot; 3-lane: Studio / WebUI / Candidate
        </p>
        <div className="h-px bg-purple-500/20 mt-4" />
      </div>

      {/* 1. Badge */}
      <FamilySection name="Badge">
        <Lane variant="Studio" color="purple">
          <div className="flex flex-wrap gap-2">
            <BadgeStudioRaw label="NEUTRAL" tone="neutral" />
            <BadgeStudioRaw label="SUCCESS" tone="success" />
            <BadgeStudioRaw label="WARNING" tone="warning" />
            <BadgeStudioRaw label="DANGER" tone="danger" />
          </div>
        </Lane>
        <Lane variant="WebUI" color="amber">
          <div className="flex flex-wrap gap-2">
            <BadgeWebUiRaw label="NEUTRAL" tone="neutral" />
            <BadgeWebUiRaw label="SUCCESS" tone="success" />
            <BadgeWebUiRaw label="WARNING" tone="warning" />
            <BadgeWebUiRaw label="DANGER" tone="danger" />
          </div>
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <div className="flex flex-wrap gap-2">
            <BadgeCandidate label="NEUTRAL" tone="neutral" />
            <BadgeCandidate label="SUCCESS" tone="success" />
            <BadgeCandidate label="WARNING" tone="warning" />
            <BadgeCandidate label="DANGER" tone="danger" />
          </div>
        </Lane>
      </FamilySection>

      {/* 2. Button */}
      <FamilySection name="Button">
        <Lane variant="Studio" color="purple">
          <div className="flex flex-wrap gap-2">
            <ButtonStudioRaw label="Primary" tone="primary" size="sm" />
            <ButtonStudioRaw label="Ghost" tone="ghost" size="sm" />
            <ButtonStudioRaw label="Danger" tone="danger" size="sm" />
          </div>
        </Lane>
        <Lane variant="WebUI" color="amber">
          <div className="flex flex-wrap gap-2">
            <ButtonWebUiRaw label="Primary" tone="primary" size="sm" />
            <ButtonWebUiRaw label="Ghost" tone="ghost" size="sm" />
            <ButtonWebUiRaw label="Danger" tone="danger" size="sm" />
          </div>
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <div className="flex flex-wrap gap-2">
            <ButtonCandidate label="Primary" tone="primary" size="sm" />
            <ButtonCandidate label="Ghost" tone="ghost" size="sm" />
            <ButtonCandidate label="Danger" tone="danger" size="sm" />
          </div>
        </Lane>
      </FamilySection>

      {/* 3. IconButton */}
      <FamilySection name="IconButton">
        <Lane variant="Studio" color="purple">
          <div className="flex items-center gap-2">
            <IconButtonStudioRaw label="Neutral" tone="neutral" size="sm" />
            <IconButtonStudioRaw label="Primary" tone="primary" size="md" />
            <IconButtonStudioRaw label="Danger" tone="danger" size="lg" />
          </div>
        </Lane>
        <Lane variant="WebUI" color="amber">
          <div className="flex items-center gap-2">
            <IconButtonWebUiRaw label="Neutral" tone="neutral" size="sm" />
            <IconButtonWebUiRaw label="Primary" tone="primary" size="md" />
            <IconButtonWebUiRaw label="Danger" tone="danger" size="lg" />
          </div>
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <div className="flex items-center gap-2">
            <IconButtonCandidate label="Neutral" tone="neutral" size="sm" />
            <IconButtonCandidate label="Primary" tone="primary" size="md" />
            <IconButtonCandidate label="Danger" tone="danger" size="lg" />
          </div>
        </Lane>
      </FamilySection>

      {/* 4. Input */}
      <FamilySection name="Input">
        <Lane variant="Studio" color="purple">
          <InputStudioRaw label="Agent Name" placeholder="Enter name..." hint="Required" />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <InputWebUiRaw label="Agent Name" placeholder="Enter name..." hint="Required" />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <InputCandidate label="Agent Name" placeholder="Enter name..." hint="Required" />
        </Lane>
      </FamilySection>

      {/* 5. SearchInput */}
      <FamilySection name="SearchInput">
        <Lane variant="Studio" color="purple">
          <SearchInputStudioRaw defaultQuery="opus" placeholder="Search logs..." />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <SearchInputWebUiRaw defaultQuery="opus" placeholder="Search logs..." />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <SearchInputCandidate defaultQuery="opus" placeholder="Search logs..." />
        </Lane>
      </FamilySection>

      {/* 6. Spinner */}
      <FamilySection name="Spinner">
        <Lane variant="Studio" color="purple">
          <SpinnerStudioRaw size="md" label="Loading" />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <SpinnerWebUiRaw size="md" label="Loading" />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <SpinnerCandidate size="md" label="Loading" />
        </Lane>
      </FamilySection>

      {/* 7. EmptyState */}
      <FamilySection name="EmptyState">
        <Lane variant="Studio" color="purple">
          <EmptyStateStudioRaw title="No agents" description="Launch one to begin." ctaLabel="Start" />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <EmptyStateWebUiRaw title="No agents" description="Launch one to begin." ctaLabel="Start" />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <EmptyStateCandidate title="No agents" description="Launch one to begin." ctaLabel="Start" />
        </Lane>
      </FamilySection>

      {/* 8. ContextMenu */}
      <FamilySection name="ContextMenu">
        <Lane variant="Studio" color="purple">
          <ContextMenuStudioRaw title="Actions" actions={contextMenuActions} />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <ContextMenuWebUiRaw title="Actions" actions={contextMenuActions} />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <ContextMenuCandidate title="Actions" actions={contextMenuActions} />
        </Lane>
      </FamilySection>

      {/* 9. Timeline */}
      <FamilySection name="Timeline">
        <Lane variant="Studio" color="purple">
          <TimelineStudioRaw items={timelineItems} />
        </Lane>
        <Lane variant="WebUI" color="amber">
          <TimelineWebUiRaw items={timelineItems} />
        </Lane>
        <Lane variant="Candidate" color="cyan">
          <TimelineCandidate items={timelineItems} />
        </Lane>
      </FamilySection>

      {/* 10. CodeDiffViewer — wider lanes */}
      <section className="space-y-3">
        <h2 className="text-sm text-cyan-300 uppercase tracking-wider font-mono">CodeDiffViewer</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Lane variant="Studio" color="purple">
            <CodeDiffViewerStudioRaw title="router.ts" before={diffBefore} after={diffAfter} />
          </Lane>
          <Lane variant="WebUI" color="amber">
            <CodeDiffViewerWebUiRaw title="router.ts" before={diffBefore} after={diffAfter} />
          </Lane>
          <Lane variant="Candidate" color="cyan">
            <CodeDiffViewerCandidate title="router.ts" before={diffBefore} after={diffAfter} />
          </Lane>
        </div>
      </section>

      {/* 11. LogViewer — Candidate is DEFERRED (different props) */}
      <section className="space-y-3">
        <h2 className="text-sm text-cyan-300 uppercase tracking-wider font-mono">LogViewer</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Lane variant="Studio" color="purple">
            <LogViewerStudioRaw entries={logEntries} maxHeight={160} />
          </Lane>
          <Lane variant="WebUI" color="amber">
            <LogViewerWebUiRaw entries={logEntries} maxHeight={160} />
          </Lane>
          <Lane variant="Candidate (Deferred)" color="cyan">
            <LogViewerCandidate
              reason="Deferred: evaluate virtualization and ANSI rendering parity before merge."
              ticket="MIG-LOGVIEWER"
            />
          </Lane>
        </div>
      </section>
    </div>
  ),
};
