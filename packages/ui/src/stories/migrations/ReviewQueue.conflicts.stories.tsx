import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import {
  BadgeCandidate,
  BadgeStudioRaw,
  BadgeWebUiRaw,
  ButtonCandidate,
  ButtonStudioRaw,
  ButtonWebUiRaw,
  CodeDiffViewerCandidate,
  CodeDiffViewerStudioRaw,
  CodeDiffViewerWebUiRaw,
  ContextMenuCandidate,
  ContextMenuStudioRaw,
  ContextMenuWebUiRaw,
  EmptyStateCandidate,
  EmptyStateStudioRaw,
  EmptyStateWebUiRaw,
  IconButtonCandidate,
  IconButtonStudioRaw,
  IconButtonWebUiRaw,
  InputCandidate,
  InputStudioRaw,
  InputWebUiRaw,
  LogViewerCandidate,
  LogViewerStudioRaw,
  LogViewerWebUiRaw,
  SearchInputCandidate,
  SearchInputStudioRaw,
  SearchInputWebUiRaw,
  SpinnerCandidate,
  SpinnerStudioRaw,
  SpinnerWebUiRaw,
  TimelineCandidate,
  TimelineStudioRaw,
  TimelineWebUiRaw,
  type ContextMenuAction,
  type LogEntry,
  type TimelineItem,
} from "../../components/migrations";

interface ReviewRowProps {
  family: string;
  studio: ReactNode;
  webUi: ReactNode;
  candidate: ReactNode;
}

function ReviewRow({ family, studio, webUi, candidate }: ReviewRowProps) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-zinc-800 pb-3 md:grid-cols-[180px_1fr_1fr_1fr]">
      <div className="text-sm font-semibold text-zinc-200">{family}</div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/70 p-3">{studio}</div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/70 p-3">{webUi}</div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/70 p-3">
        {candidate}
      </div>
    </div>
  );
}

const diffBefore = `const syncQueue = [];
function pushTask(task) {
  syncQueue.push(task);
  return syncQueue.length;
}`;

const diffAfter = `const syncQueue: Task[] = [];
function pushTask(task: Task) {
  syncQueue.unshift(task);
  return syncQueue.length;
}`;

const menuActions: ContextMenuAction[] = [
  { id: "open", label: "Open Item", shortcut: "Enter" },
  { id: "duplicate", label: "Duplicate", shortcut: "D" },
  { id: "archive", label: "Archive", shortcut: "A", danger: true },
];

const timelineItems: TimelineItem[] = [
  {
    id: "1",
    title: "Collect conflict artifacts",
    detail: "Gather Studio + Web-UI primitives",
    time: "09:14",
    status: "done",
  },
  {
    id: "2",
    title: "Map canonical surface",
    detail: "Evaluate props against @kingly/ui",
    time: "09:27",
    status: "active",
  },
  {
    id: "3",
    title: "Approve candidate paths",
    detail: "Queue for migration board review",
    time: "09:42",
    status: "queued",
  },
];

const logEntries: LogEntry[] = [
  {
    id: "1",
    timestamp: "09:10:02",
    level: "info",
    message: "UI package: loaded migration stories",
    source: "storybook",
  },
  {
    id: "2",
    timestamp: "09:10:19",
    level: "warn",
    message: "LogViewer candidate unresolved: virtualization pending",
    source: "migration-review",
  },
  {
    id: "3",
    timestamp: "09:10:40",
    level: "error",
    message: "Legacy ANSI parser unavailable in web-ui raw artifact",
    source: "artifact-check",
  },
];

const meta = {
  title: "Migrations/ReviewQueue/Conflicts",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Conflict review board for migration-first artifacts. Each row shows Studio raw, Web-UI raw, and candidate/deferred outcome.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Queue: Story = {
  render: () => (
    <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="grid grid-cols-1 gap-3 rounded-md border border-zinc-800 bg-zinc-900/80 p-3 md:grid-cols-[180px_1fr_1fr_1fr]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Family
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Studio Raw
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Web-UI Raw
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Candidate / Deferred
          </span>
        </div>

        <ReviewRow
          family="Badge"
          studio={<BadgeStudioRaw label="Studio Beta" tone="warning" />}
          webUi={<BadgeWebUiRaw label="Web Beta" tone="warning" />}
          candidate={<BadgeCandidate label="Candidate" tone="warning" />}
        />

        <ReviewRow
          family="Button"
          studio={
            <ButtonStudioRaw
              label="Deploy"
              tone="primary"
              leadingIcon={<Sparkles size={14} />}
            />
          }
          webUi={
            <ButtonWebUiRaw
              label="Deploy"
              tone="secondary"
              leadingIcon={<Sparkles size={14} />}
            />
          }
          candidate={
            <ButtonCandidate
              label="Deploy"
              tone="primary"
              leadingIcon={<Sparkles size={14} />}
            />
          }
        />

        <ReviewRow
          family="CodeDiffViewer"
          studio={<CodeDiffViewerStudioRaw before={diffBefore} after={diffAfter} />}
          webUi={<CodeDiffViewerWebUiRaw before={diffBefore} after={diffAfter} />}
          candidate={<CodeDiffViewerCandidate before={diffBefore} after={diffAfter} />}
        />

        <ReviewRow
          family="ContextMenu"
          studio={<ContextMenuStudioRaw actions={menuActions} />}
          webUi={<ContextMenuWebUiRaw actions={menuActions} />}
          candidate={<ContextMenuCandidate actions={menuActions} />}
        />

        <ReviewRow
          family="EmptyState"
          studio={
            <EmptyStateStudioRaw
              title="No migration snapshots"
              description="Capture artifacts to continue review."
              ctaLabel="Create Snapshot"
              icon={<AlertTriangle size={16} />}
            />
          }
          webUi={
            <EmptyStateWebUiRaw
              title="No migration snapshots"
              description="Capture artifacts to continue review."
              ctaLabel="Create Snapshot"
              icon={<AlertTriangle size={16} />}
            />
          }
          candidate={
            <EmptyStateCandidate
              title="No migration snapshots"
              description="Capture artifacts to continue review."
              ctaLabel="Create Snapshot"
              icon={<AlertTriangle size={16} />}
            />
          }
        />

        <ReviewRow
          family="IconButton"
          studio={
            <IconButtonStudioRaw
              label="Confirm"
              tone="primary"
              icon={<CheckCircle2 size={14} />}
            />
          }
          webUi={
            <IconButtonWebUiRaw
              label="Confirm"
              tone="primary"
              icon={<CheckCircle2 size={14} />}
            />
          }
          candidate={
            <IconButtonCandidate
              label="Confirm"
              tone="primary"
              icon={<CheckCircle2 size={14} />}
            />
          }
        />

        <ReviewRow
          family="Input"
          studio={
            <InputStudioRaw
              label="Host"
              defaultValue="node-17.internal"
              hint="Used by telemetry stream"
            />
          }
          webUi={
            <InputWebUiRaw
              label="Host"
              defaultValue="node-17.internal"
              hint="Used by telemetry stream"
            />
          }
          candidate={
            <InputCandidate
              label="Host"
              defaultValue="node-17.internal"
              hint="Used by telemetry stream"
            />
          }
        />

        <ReviewRow
          family="SearchInput"
          studio={<SearchInputStudioRaw defaultQuery="migration queue" />}
          webUi={<SearchInputWebUiRaw defaultQuery="migration queue" />}
          candidate={<SearchInputCandidate defaultQuery="migration queue" />}
        />

        <ReviewRow
          family="Spinner"
          studio={<SpinnerStudioRaw label="Compiling" />}
          webUi={<SpinnerWebUiRaw label="Compiling" />}
          candidate={<SpinnerCandidate label="Compiling" />}
        />

        <ReviewRow
          family="Timeline"
          studio={<TimelineStudioRaw items={timelineItems} />}
          webUi={<TimelineWebUiRaw items={timelineItems} />}
          candidate={<TimelineCandidate items={timelineItems} />}
        />

        <ReviewRow
          family="LogViewer"
          studio={<LogViewerStudioRaw entries={logEntries} />}
          webUi={<LogViewerWebUiRaw entries={logEntries} />}
          candidate={<LogViewerCandidate />}
        />
      </div>
    </div>
  ),
};

export const Default = Queue;
