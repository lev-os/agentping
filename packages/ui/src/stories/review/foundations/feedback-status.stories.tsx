import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ReviewPageLayout } from "../_shared/ReviewPageLayout";
import { ComponentCard } from "../_shared/ComponentCard";
import type { ComponentMeta } from "../_shared/types";
import { AlertBanner } from "../../../components/catalog/alert-banner";
import { ToastManager } from "../../../components/catalog/toast-manager";
import { Skeleton } from "../../../components/catalog/skeleton";
import { LoadingProgress } from "../../../components/catalog/loading-progress";
import { ProgressBar } from "../../../components/catalog/progress-bar";
import { TypingIndicator } from "../../../components/catalog/typing-indicator";
import { ErrorBoundary } from "../../../components/catalog/error-boundary";
import { ConfirmationModal } from "../../../components/catalog/confirmation-modal";
import { HoverCard } from "../../../components/catalog/hover-card";
import { StreamingIndicator } from "../../../components/catalog/streaming-indicator";

const meta: Meta = {
  title: "Review/Foundations/Feedback & Status",
};
export default meta;

function m(
  id: string,
  name: string,
  gateStatus: ComponentMeta["gateStatus"] = "pass",
  classification: ComponentMeta["classification"] = "REAL",
): ComponentMeta {
  return {
    id,
    name,
    family: "foundations/feedback-status",
    domain: "webui",
    lanes: ["agentping"],
    beadId: "",
    storyPath: "Review/Foundations/Feedback & Status",
    gateStatus,
    classification,
    markers: [],
  };
}

export const Overview: StoryObj = {
  render: () => (
    <ReviewPageLayout
      title="Feedback & Status"
      category="Foundations"
      description="Alerts, toasts, progress, loading states, error boundaries, modals, and hover interactions"
      componentCount={10}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AlertBanner */}
        <ComponentCard meta={m("alert-banner", "AlertBanner")}>
          <div className="space-y-2">
            <AlertBanner
              type="warning"
              title="Memory Threshold"
              message="Agent memory usage exceeding 85% threshold"
              onDismiss={() => {}}
            />
            <AlertBanner
              type="error"
              message="Connection to cluster node-03 lost"
            />
            <AlertBanner
              type="success"
              message="Deployment completed successfully"
            />
            <AlertBanner
              type="info"
              message="New model version available: gpt-4o-2026-02"
            />
          </div>
        </ComponentCard>

        {/* ToastManager (inline preview) */}
        <ComponentCard meta={m("toast-manager", "ToastManager")}>
          <div className="relative">
            <ToastManager
              toasts={[
                {
                  id: "1",
                  type: "success",
                  message: "Agent deployed to production",
                },
                {
                  id: "2",
                  type: "warning",
                  message: "Rate limit approaching",
                },
                {
                  id: "3",
                  type: "error",
                  message: "Pipeline execution failed",
                },
              ]}
              onDismiss={() => {}}
            />
            <p className="text-[10px] text-cyan-500/30 mt-1">
              ToastManager renders as fixed overlay; toasts appear in top-right
            </p>
          </div>
        </ComponentCard>

        {/* Skeleton */}
        <ComponentCard meta={m("skeleton", "Skeleton")}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" width={40} />
              <div className="flex-1">
                <Skeleton variant="text" count={2} />
              </div>
            </div>
            <Skeleton variant="rect" width="100%" height={60} />
          </div>
        </ComponentCard>

        {/* LoadingProgress */}
        <ComponentCard meta={m("loading-progress", "LoadingProgress")}>
          <LoadingProgress
            stages={[
              {
                id: "fetch",
                label: "Fetching model weights",
                status: "complete",
              },
              {
                id: "validate",
                label: "Validating configuration",
                status: "complete",
              },
              {
                id: "deploy",
                label: "Deploying to cluster",
                status: "loading",
              },
              {
                id: "verify",
                label: "Running health checks",
                status: "pending",
              },
            ]}
          />
        </ComponentCard>

        {/* ProgressBar */}
        <ComponentCard meta={m("progress-bar", "ProgressBar")}>
          <div className="space-y-3">
            <ProgressBar
              value={67}
              max={100}
              label="Training Progress"
              variant="default"
            />
            <ProgressBar
              value={100}
              max={100}
              label="Upload Complete"
              variant="success"
            />
            <ProgressBar
              value={85}
              max={100}
              label="Memory Usage"
              variant="warning"
            />
            <ProgressBar
              value={23}
              max={100}
              label="Error Rate"
              variant="error"
            />
          </div>
        </ComponentCard>

        {/* TypingIndicator */}
        <ComponentCard meta={m("typing-indicator", "TypingIndicator")}>
          <div className="flex items-center gap-3">
            <TypingIndicator />
            <span className="text-xs text-cyan-500/50">
              Agent is thinking...
            </span>
          </div>
        </ComponentCard>

        {/* ErrorBoundary */}
        <ComponentCard meta={m("error-boundary", "ErrorBoundary")}>
          <ErrorBoundary
            fallback={
              <div className="border border-red-500/50 bg-red-500/10 rounded-md p-4">
                <div className="text-sm font-medium text-red-400">
                  Something went wrong
                </div>
                <div className="text-xs text-red-400/60 mt-1">
                  Component rendering failed: Cannot read properties of
                  undefined
                </div>
              </div>
            }
          >
            <div className="text-xs text-cyan-300">
              This content is protected by ErrorBoundary
            </div>
          </ErrorBoundary>
          <p className="text-[10px] text-cyan-500/30 mt-1">
            Fallback shown above for demo; boundary wraps child content
          </p>
        </ComponentCard>

        {/* ConfirmationModal (inline preview) */}
        <ComponentCard meta={m("confirmation-modal", "ConfirmationModal")}>
          <div className="relative border border-cyan-500/10 rounded-lg p-4 bg-black/40">
            <h3 className="text-sm font-semibold text-cyan-100 mb-2">
              Delete Agent?
            </h3>
            <p className="text-xs text-cyan-500/50 mb-4">
              This action cannot be undone. All associated data, logs, and
              configurations will be permanently removed.
            </p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5 text-xs rounded border border-cyan-500/20 text-cyan-300">
                Cancel
              </button>
              <button className="px-3 py-1.5 text-xs rounded bg-red-500/20 border border-red-500/40 text-red-300">
                Delete
              </button>
            </div>
          </div>
          <p className="text-[10px] text-cyan-500/30 mt-1">
            ConfirmationModal renders as fixed overlay; shown here as inline
            preview
          </p>
        </ComponentCard>

        {/* HoverCard */}
        <ComponentCard meta={m("hover-card", "HoverCard")}>
          <HoverCard
            trigger={
              <span className="text-cyan-400 underline underline-offset-2 cursor-pointer text-sm">
                Hover over me
              </span>
            }
            align="bottom"
            delayMs={100}
          >
            <div className="space-y-1">
              <div className="text-xs font-medium text-cyan-100">
                Agent: worker-01
              </div>
              <div className="text-[10px] text-cyan-500/60">
                Status: Active | Tasks: 142 | Uptime: 4h 23m
              </div>
            </div>
          </HoverCard>
        </ComponentCard>

        {/* StreamingIndicator */}
        <ComponentCard meta={m("streaming-indicator", "StreamingIndicator")}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-500/50">Connected:</span>
              <StreamingIndicator isConnected={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-500/50">Live:</span>
              <StreamingIndicator isConnected={true} isTrainingActive={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-500/50">Disconnected:</span>
              <StreamingIndicator isConnected={false} />
            </div>
          </div>
        </ComponentCard>
      </div>
    </ReviewPageLayout>
  ),
};
