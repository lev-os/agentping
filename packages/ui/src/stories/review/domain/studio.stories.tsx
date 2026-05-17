import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  BadgeStudioRaw,
  ButtonStudioRaw,
  CodeDiffViewerStudioRaw,
  ContextMenuStudioRaw,
  EmptyStateStudioRaw,
  IconButtonStudioRaw,
  InputStudioRaw,
  SearchInputStudioRaw,
  SpinnerStudioRaw,
  TimelineStudioRaw,
  LogViewerStudioRaw,
} from "../../../components/catalog";

/* ------------------------------------------------------------------ */
/* Mock Data                                                           */
/* ------------------------------------------------------------------ */

const logEntries = [
  { id: "1", timestamp: "08:00:01", level: "info" as const, message: "Agent initialized successfully" },
  { id: "2", timestamp: "08:00:05", level: "debug" as const, message: "Loading workspace configuration" },
  { id: "3", timestamp: "08:00:12", level: "warn" as const, message: "Deprecated API call detected" },
  { id: "4", timestamp: "08:00:18", level: "error" as const, message: "Plugin failed to load: missing manifest" },
];

const timelineItems = [
  { id: "1", title: "Deploy initiated", detail: "Production rollout v2.4.1", time: "08:00", status: "done" as const },
  { id: "2", title: "Build verified", detail: "All 847 tests passing", time: "08:05", status: "done" as const },
  { id: "3", title: "Canary deploy", detail: "5% traffic routed to new pods", time: "08:10", status: "active" as const },
  { id: "4", title: "Full rollout", detail: "Pending canary health check", time: "08:30", status: "queued" as const },
];

const contextMenuActions = [
  { id: "edit", label: "Edit", shortcut: "Cmd+E" },
  { id: "duplicate", label: "Duplicate", shortcut: "Cmd+D" },
  { id: "move", label: "Move to...", shortcut: "Cmd+M" },
  { id: "archive", label: "Archive" },
  { id: "delete", label: "Delete", shortcut: "Backspace", danger: true },
];

const codeBefore = `function deploy(config) {
  const env = config.env;
  console.log("Deploying to " + env);
  return fetch("/api/deploy");
}`;

const codeAfter = `async function deploy(config: DeployConfig) {
  const { env, version } = config;
  logger.info(\`Deploying v\${version} to \${env}\`);
  return await api.deploy({ env, version });
}`;

/* ------------------------------------------------------------------ */
/* Studio Card                                                         */
/* ------------------------------------------------------------------ */

function StudioCard({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border border-purple-500/20 rounded-lg bg-black/40">
      <div className="text-[10px] text-purple-400 mb-2 uppercase tracking-wider font-mono">{name}</div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

function StudioComponentsReview() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-purple-100 font-mono">Studio Components</h1>
          <p className="text-sm text-purple-500/60 mt-1 font-mono">
            11 conflict-family StudioRaw variants -- originating from packages/studio
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* BadgeStudioRaw */}
          <StudioCard name="BadgeStudioRaw">
            <div className="flex flex-wrap gap-2">
              <BadgeStudioRaw label="DEFAULT" />
              <BadgeStudioRaw label="SUCCESS" tone="success" />
              <BadgeStudioRaw label="WARNING" tone="warning" />
              <BadgeStudioRaw label="DANGER" tone="danger" />
              <BadgeStudioRaw label="SUBTLE" tone="neutral" subtle />
            </div>
          </StudioCard>

          {/* ButtonStudioRaw */}
          <StudioCard name="ButtonStudioRaw">
            <div className="flex flex-wrap gap-2">
              <ButtonStudioRaw label="Primary" tone="primary" />
              <ButtonStudioRaw label="Secondary" tone="secondary" />
              <ButtonStudioRaw label="Ghost" tone="ghost" />
              <ButtonStudioRaw label="Danger" tone="danger" />
              <ButtonStudioRaw label="Small" tone="primary" size="sm" />
            </div>
          </StudioCard>

          {/* SpinnerStudioRaw */}
          <StudioCard name="SpinnerStudioRaw">
            <div className="flex items-center gap-6">
              <SpinnerStudioRaw size="sm" label="Loading" />
              <SpinnerStudioRaw size="md" label="Processing" />
              <SpinnerStudioRaw size="lg" label="Deploying" />
            </div>
          </StudioCard>

          {/* InputStudioRaw */}
          <StudioCard name="InputStudioRaw">
            <div className="flex flex-col gap-3">
              <InputStudioRaw label="Agent Name" placeholder="Enter agent name..." />
              <InputStudioRaw label="API Key" status="error" hint="Invalid key format" placeholder="sk-..." />
              <InputStudioRaw label="Region" status="success" hint="Verified" placeholder="us-east-1" />
            </div>
          </StudioCard>

          {/* SearchInputStudioRaw */}
          <StudioCard name="SearchInputStudioRaw">
            <div className="flex flex-col gap-3">
              <SearchInputStudioRaw placeholder="Search agents..." />
              <SearchInputStudioRaw placeholder="Searching..." loading />
            </div>
          </StudioCard>

          {/* IconButtonStudioRaw */}
          <StudioCard name="IconButtonStudioRaw">
            <div className="flex items-center gap-3">
              <IconButtonStudioRaw label="Settings" icon={<span>&#9881;</span>} tone="neutral" />
              <IconButtonStudioRaw label="Add" icon={<span>+</span>} tone="primary" />
              <IconButtonStudioRaw label="Delete" icon={<span>&times;</span>} tone="danger" />
              <IconButtonStudioRaw label="Small" icon={<span>&#8226;</span>} tone="neutral" size="xs" />
            </div>
          </StudioCard>

          {/* ContextMenuStudioRaw */}
          <StudioCard name="ContextMenuStudioRaw">
            <ContextMenuStudioRaw title="Agent Actions" actions={contextMenuActions} />
          </StudioCard>

          {/* EmptyStateStudioRaw */}
          <StudioCard name="EmptyStateStudioRaw">
            <EmptyStateStudioRaw
              title="No agents found"
              description="Create your first agent to get started with the platform."
              ctaLabel="Create Agent"
            />
          </StudioCard>

          {/* TimelineStudioRaw */}
          <StudioCard name="TimelineStudioRaw">
            <TimelineStudioRaw items={timelineItems} />
          </StudioCard>

          {/* LogViewerStudioRaw */}
          <StudioCard name="LogViewerStudioRaw">
            <LogViewerStudioRaw entries={logEntries} maxHeight={200} />
          </StudioCard>

          {/* CodeDiffViewerStudioRaw */}
          <StudioCard name="CodeDiffViewerStudioRaw">
            <CodeDiffViewerStudioRaw
              before={codeBefore}
              after={codeAfter}
              title="deploy.ts refactor"
            />
          </StudioCard>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Review/Domain/Studio Components",
  component: StudioComponentsReview,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
