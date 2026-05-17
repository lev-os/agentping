import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ReviewPageLayout } from "../_shared/ReviewPageLayout";
import { ComponentCard } from "../_shared/ComponentCard";
import { ComparePanel } from "../_shared/ComparePanel";
import type { ComponentMeta } from "../_shared/types";

import {
  BadgeStudioRaw,
  BadgeWebUiRaw,
  BadgeCandidate,
} from "../../../components/catalog/badge-conflict";
import {
  SpinnerStudioRaw,
  SpinnerWebUiRaw,
  SpinnerCandidate,
} from "../../../components/catalog/spinner-conflict";
import { LiveBadge } from "../../../components/catalog/live-badge";
import { StatusIndicator } from "../../../components/catalog/status-indicator";
import { ConnectionSignal } from "../../../components/catalog/connection-signal";
import { BatteryMeter } from "../../../components/catalog/battery-meter";
import { Rating } from "../../../components/catalog/rating";
import { ConfidenceMeter } from "../../../components/catalog/confidence-meter";
import { CircularProgress } from "../../../components/catalog/circular-progress";
import { ArtifactBadge } from "../../../components/catalog/artifact-badge";
import { StatusDot } from "../../../components/catalog/status-dot";

const meta: Meta = {
  title: "Review/Foundations/Badges Labels & Indicators",
};
export default meta;

function m(
  id: string,
  name: string,
  gateStatus: ComponentMeta["gateStatus"] = "pass",
  classification: ComponentMeta["classification"] = "REAL",
  domain: ComponentMeta["domain"] = "webui",
): ComponentMeta {
  return {
    id,
    name,
    family: "foundations/badges-labels-indicators",
    domain,
    lanes: ["agentping"],
    beadId: "",
    storyPath: "Review/Foundations/Badges Labels & Indicators",
    gateStatus,
    classification,
    markers: [],
  };
}

export const Overview: StoryObj = {
  render: () => (
    <ReviewPageLayout
      title="Badges, Labels & Indicators"
      category="Foundations"
      description="Badges, spinners, live indicators, signal meters, battery, rating, confidence, progress, and status dots"
      componentCount={11}
    >
      {/* Conflict: Badge */}
      <div className="mb-6">
        <ComparePanel
          title="Badge (Conflict Family)"
          lanes={[
            {
              id: "badge-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: (
                <div className="flex flex-wrap gap-2">
                  <BadgeWebUiRaw label="Neutral" tone="neutral" />
                  <BadgeWebUiRaw label="Success" tone="success" />
                  <BadgeWebUiRaw label="Warning" tone="warning" />
                  <BadgeWebUiRaw label="Danger" tone="danger" />
                </div>
              ),
            },
            {
              id: "badge-studio",
              label: "Studio",
              variant: "sophia",
              content: (
                <div className="flex flex-wrap gap-2">
                  <BadgeStudioRaw label="Neutral" tone="neutral" />
                  <BadgeStudioRaw label="Success" tone="success" />
                  <BadgeStudioRaw label="Warning" tone="warning" />
                  <BadgeStudioRaw label="Danger" tone="danger" />
                </div>
              ),
            },
            {
              id: "badge-candidate",
              label: "Candidate",
              variant: "combined",
              content: (
                <div className="flex flex-wrap gap-2">
                  <BadgeCandidate label="Neutral" tone="neutral" />
                  <BadgeCandidate label="Success" tone="success" />
                  <BadgeCandidate label="Warning" tone="warning" />
                  <BadgeCandidate label="Danger" tone="danger" />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Conflict: Spinner */}
      <div className="mb-6">
        <ComparePanel
          title="Spinner (Conflict Family)"
          lanes={[
            {
              id: "spinner-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: (
                <div className="flex flex-wrap gap-4 items-center">
                  <SpinnerWebUiRaw size="sm" label="Loading" />
                  <SpinnerWebUiRaw size="md" label="Processing" />
                  <SpinnerWebUiRaw size="lg" label="Syncing" />
                </div>
              ),
            },
            {
              id: "spinner-studio",
              label: "Studio",
              variant: "sophia",
              content: (
                <div className="flex flex-wrap gap-4 items-center">
                  <SpinnerStudioRaw size="sm" label="Loading" />
                  <SpinnerStudioRaw size="md" label="Processing" />
                  <SpinnerStudioRaw size="lg" label="Syncing" />
                </div>
              ),
            },
            {
              id: "spinner-candidate",
              label: "Candidate",
              variant: "combined",
              content: (
                <div className="flex flex-wrap gap-4 items-center">
                  <SpinnerCandidate size="sm" label="Loading" />
                  <SpinnerCandidate size="md" label="Processing" />
                  <SpinnerCandidate size="lg" label="Syncing" />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Regular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard meta={m("live-badge", "LiveBadge")}>
          <div className="flex flex-wrap gap-4">
            <LiveBadge />
            <LiveBadge label="STREAMING" pulsing={true} />
            <LiveBadge label="RECORDING" pulsing={false} />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("status-indicator", "StatusIndicator")}>
          <div className="space-y-2">
            <StatusIndicator status="online" label="Agent Alpha" />
            <StatusIndicator status="busy" label="Agent Beta" />
            <StatusIndicator status="away" label="Agent Gamma" />
            <StatusIndicator status="offline" label="Agent Delta" />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("connection-signal", "ConnectionSignal")}>
          <div className="flex gap-6 items-end">
            <div className="flex flex-col items-center gap-1">
              <ConnectionSignal strength={4} maxBars={4} />
              <span className="text-[10px] text-cyan-500/40">Strong</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ConnectionSignal strength={2} maxBars={4} />
              <span className="text-[10px] text-cyan-500/40">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ConnectionSignal strength={1} maxBars={4} />
              <span className="text-[10px] text-cyan-500/40">Weak</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ConnectionSignal strength={0} maxBars={4} />
              <span className="text-[10px] text-cyan-500/40">None</span>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard meta={m("battery-meter", "BatteryMeter")}>
          <div className="space-y-3">
            <BatteryMeter level={92} charging={true} />
            <BatteryMeter level={45} label="Backup" />
            <BatteryMeter level={12} />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("rating", "Rating")}>
          <div className="space-y-3">
            <Rating value={4} max={5} readOnly />
            <Rating value={2} max={5} />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("confidence-meter", "ConfidenceMeter")}>
          <div className="space-y-3 w-full">
            <ConfidenceMeter value={92} label="Model accuracy" />
            <ConfidenceMeter value={61} label="Prediction" />
            <ConfidenceMeter value={23} label="Anomaly score" />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("circular-progress", "CircularProgress")}>
          <div className="flex gap-4 items-center">
            <CircularProgress value={75} size={56} label="CPU" />
            <CircularProgress value={42} size={56} label="Memory" />
            <CircularProgress value={91} size={56} label="Disk" />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("artifact-badge", "ArtifactBadge", "pass", "RE-EXPORT")}>
          <div className="space-y-3">
            <ArtifactBadge
              id="art-1"
              name="@kingly/ui"
              type="npm"
              version="2.1.0"
              status="available"
              variant="compact"
            />
            <ArtifactBadge
              id="art-2"
              name="agent-worker"
              type="docker"
              version="latest"
              status="pending"
              variant="default"
            />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("status-dot", "StatusDot", "pass", "RE-EXPORT")}>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <StatusDot status="online" pulse />
              <span className="text-xs text-cyan-500/60">Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="busy" />
              <span className="text-xs text-cyan-500/60">Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="error" pulse />
              <span className="text-xs text-cyan-500/60">Error</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="offline" />
              <span className="text-xs text-cyan-500/60">Offline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="warning" size="lg" />
              <span className="text-xs text-cyan-500/60">Warning (lg)</span>
            </div>
          </div>
        </ComponentCard>
      </div>
    </ReviewPageLayout>
  ),
};
