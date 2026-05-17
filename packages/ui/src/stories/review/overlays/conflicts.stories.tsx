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
  title: "Review/Overlays/Conflict Families",
};
export default meta;

type Story = StoryObj;

function FamilySection({
  name,
  studio,
  webui,
  candidate,
}: {
  name: string;
  studio: React.ReactNode;
  webui: React.ReactNode;
  candidate: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-cyan-400">{name}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">
          CONFLICT
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-violet-500/20 bg-black/40 rounded-lg p-3">
          <div className="text-[9px] text-violet-400/60 font-mono mb-2 uppercase">
            Studio Raw
          </div>
          {studio}
        </div>
        <div className="border border-blue-500/20 bg-black/40 rounded-lg p-3">
          <div className="text-[9px] text-blue-400/60 font-mono mb-2 uppercase">
            WebUI Raw
          </div>
          {webui}
        </div>
        <div className="border border-emerald-500/20 bg-black/40 rounded-lg p-3">
          <div className="text-[9px] text-emerald-400/60 font-mono mb-2 uppercase">
            Candidate
          </div>
          {candidate}
        </div>
      </div>
    </div>
  );
}

const TIMELINE_ITEMS = [
  { id: "1", title: "Deploy v2.1", detail: "Production release", time: "2h ago", status: "done" as const },
  { id: "2", title: "Run tests", detail: "Integration suite", time: "3h ago", status: "done" as const },
  { id: "3", title: "Code review", time: "4h ago", status: "active" as const },
  { id: "4", title: "Design review", time: "5h ago", status: "queued" as const },
];

const LOG_ENTRIES = [
  { id: "1", timestamp: new Date().toISOString(), level: "info" as const, message: "Server started on port 3001" },
  { id: "2", timestamp: new Date().toISOString(), level: "warn" as const, message: "Deprecated API endpoint called" },
  { id: "3", timestamp: new Date().toISOString(), level: "error" as const, message: "Connection timeout to redis:6379" },
  { id: "4", timestamp: new Date().toISOString(), level: "debug" as const, message: "Cache miss for key: user:123" },
];

const CONTEXT_MENU_ACTIONS = [
  { label: "Edit", id: "edit" },
  { label: "Delete", id: "delete" },
  { label: "Duplicate", id: "duplicate" },
];

export const AllFamilies: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="border-b border-orange-500/20 pb-4">
          <h1 className="text-lg font-mono text-orange-400 uppercase tracking-wider">
            Conflict Families
          </h1>
          <p className="text-xs text-orange-400/40 mt-1">
            11 component families with Studio / WebUI / Candidate variants in 3-lane compare
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500/60" />
              <span className="text-[9px] text-gray-500">Studio</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500/60" />
              <span className="text-[9px] text-gray-500">WebUI</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
              <span className="text-[9px] text-gray-500">Candidate</span>
            </div>
          </div>
        </div>

        <FamilySection
          name="Badge"
          studio={
            <div className="flex gap-2 flex-wrap">
              <BadgeStudioRaw label="Neutral" tone="neutral" />
              <BadgeStudioRaw label="Success" tone="success" />
              <BadgeStudioRaw label="Warning" tone="warning" />
              <BadgeStudioRaw label="Danger" tone="danger" />
            </div>
          }
          webui={
            <div className="flex gap-2 flex-wrap">
              <BadgeWebUiRaw label="Neutral" tone="neutral" />
              <BadgeWebUiRaw label="Success" tone="success" />
              <BadgeWebUiRaw label="Warning" tone="warning" />
              <BadgeWebUiRaw label="Danger" tone="danger" />
            </div>
          }
          candidate={
            <div className="flex gap-2 flex-wrap">
              <BadgeCandidate label="Neutral" tone="neutral" />
              <BadgeCandidate label="Success" tone="success" />
              <BadgeCandidate label="Warning" tone="warning" />
              <BadgeCandidate label="Danger" tone="danger" />
            </div>
          }
        />

        <FamilySection
          name="Button"
          studio={
            <div className="flex gap-2 flex-wrap">
              <ButtonStudioRaw label="Primary" tone="primary" />
              <ButtonStudioRaw label="Secondary" tone="secondary" />
              <ButtonStudioRaw label="Ghost" tone="ghost" />
            </div>
          }
          webui={
            <div className="flex gap-2 flex-wrap">
              <ButtonWebUiRaw label="Primary" tone="primary" />
              <ButtonWebUiRaw label="Secondary" tone="secondary" />
              <ButtonWebUiRaw label="Ghost" tone="ghost" />
            </div>
          }
          candidate={
            <div className="flex gap-2 flex-wrap">
              <ButtonCandidate label="Primary" tone="primary" />
              <ButtonCandidate label="Secondary" tone="secondary" />
              <ButtonCandidate label="Ghost" tone="ghost" />
            </div>
          }
        />

        <FamilySection
          name="CodeDiffViewer"
          studio={<CodeDiffViewerStudioRaw before="const x = 1;" after="const x = 2;" title="Config update" />}
          webui={<CodeDiffViewerWebUiRaw before="const x = 1;" after="const x = 2;" title="Config update" />}
          candidate={<CodeDiffViewerCandidate before="const x = 1;" after="const x = 2;" title="Config update" />}
        />

        <FamilySection
          name="ContextMenu"
          studio={
            <ContextMenuStudioRaw
              actions={CONTEXT_MENU_ACTIONS}
              onActionSelect={() => {}}
            />
          }
          webui={
            <ContextMenuWebUiRaw
              actions={CONTEXT_MENU_ACTIONS}
              onActionSelect={() => {}}
            />
          }
          candidate={
            <ContextMenuCandidate
              actions={CONTEXT_MENU_ACTIONS}
              onActionSelect={() => {}}
            />
          }
        />

        <FamilySection
          name="EmptyState"
          studio={<EmptyStateStudioRaw title="No agents found" description="Create your first agent to get started" ctaLabel="Create Agent" />}
          webui={<EmptyStateWebUiRaw title="No agents found" description="Create your first agent to get started" ctaLabel="Create Agent" />}
          candidate={<EmptyStateCandidate title="No agents found" description="Create your first agent to get started" ctaLabel="Create Agent" />}
        />

        <FamilySection
          name="IconButton"
          studio={
            <div className="flex gap-2">
              <IconButtonStudioRaw label="Settings" />
              <IconButtonStudioRaw label="Edit" />
              <IconButtonStudioRaw label="Delete" tone="danger" />
            </div>
          }
          webui={
            <div className="flex gap-2">
              <IconButtonWebUiRaw label="Settings" />
              <IconButtonWebUiRaw label="Edit" />
              <IconButtonWebUiRaw label="Delete" tone="danger" />
            </div>
          }
          candidate={
            <div className="flex gap-2">
              <IconButtonCandidate label="Settings" />
              <IconButtonCandidate label="Edit" />
              <IconButtonCandidate label="Delete" tone="danger" />
            </div>
          }
        />

        <FamilySection
          name="Input"
          studio={<InputStudioRaw placeholder="Enter agent name..." label="Agent Name" />}
          webui={<InputWebUiRaw placeholder="Enter agent name..." label="Agent Name" />}
          candidate={<InputCandidate placeholder="Enter agent name..." label="Agent Name" />}
        />

        <FamilySection
          name="SearchInput"
          studio={<SearchInputStudioRaw placeholder="Search agents..." />}
          webui={<SearchInputWebUiRaw placeholder="Search agents..." />}
          candidate={<SearchInputCandidate placeholder="Search agents..." />}
        />

        <FamilySection
          name="Spinner"
          studio={
            <div className="flex gap-4 items-center">
              <SpinnerStudioRaw size="sm" />
              <SpinnerStudioRaw size="md" />
              <SpinnerStudioRaw size="lg" />
            </div>
          }
          webui={
            <div className="flex gap-4 items-center">
              <SpinnerWebUiRaw size="sm" />
              <SpinnerWebUiRaw size="md" />
              <SpinnerWebUiRaw size="lg" />
            </div>
          }
          candidate={
            <div className="flex gap-4 items-center">
              <SpinnerCandidate size="sm" />
              <SpinnerCandidate size="md" />
              <SpinnerCandidate size="lg" />
            </div>
          }
        />

        <FamilySection
          name="Timeline"
          studio={<TimelineStudioRaw items={TIMELINE_ITEMS} />}
          webui={<TimelineWebUiRaw items={TIMELINE_ITEMS} />}
          candidate={<TimelineCandidate items={TIMELINE_ITEMS} />}
        />

        <FamilySection
          name="LogViewer"
          studio={<LogViewerStudioRaw entries={LOG_ENTRIES} />}
          webui={<LogViewerWebUiRaw entries={LOG_ENTRIES} />}
          candidate={<LogViewerCandidate />}
        />
      </div>
    </div>
  ),
};
