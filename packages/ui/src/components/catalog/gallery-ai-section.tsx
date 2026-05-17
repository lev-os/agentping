"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { AgentAvatar } from "./agent-avatar";
import { ModelSelector } from "./model-selector";
import { ConfidenceMeter } from "./confidence-meter";
import { ContextUsage } from "./context-usage";
import { PromptEditor } from "./prompt-editor";
import { ToolInvocation } from "./tool-invocation";
import { BrainActivity } from "./brain-activity";
import { TokenStream } from "./token-stream";
import { MessageBubble } from "./message-bubble";
import { VectorCluster } from "./vector-cluster";

export interface GalleryAISectionProps {
  className?: string;
}

export function GalleryAISection({ className }: GalleryAISectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">AI Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="AgentAvatar">
          <div className="flex gap-2 items-center">
            <AgentAvatar name="Agent Alpha" size="sm" status="speaking" />
            <AgentAvatar name="Beta" size="sm" status="thinking" />
            <AgentAvatar name="Gamma" size="sm" status="idle" />
            <AgentAvatar name="Offline" size="sm" status="offline" />
          </div>
        </GalleryCard>

        <GalleryCard name="ModelSelector">
          <ModelSelector
            models={[
              { id: "opus", name: "Claude Opus", provider: "Anthropic" },
              { id: "sonnet", name: "Claude Sonnet", provider: "Anthropic" },
            ]}
            selected="opus"
          />
        </GalleryCard>

        <GalleryCard name="ConfidenceMeter">
          <ConfidenceMeter value={87} label="Response Confidence" />
        </GalleryCard>

        <GalleryCard name="ContextUsage">
          <ContextUsage used={68000} total={128000} label="Token Usage" />
        </GalleryCard>

        <GalleryCard name="PromptEditor">
          <PromptEditor
            value="Analyze {{input}} and return {{format}}"
            variables={["input", "format"]}
          />
        </GalleryCard>

        <GalleryCard name="ToolInvocation">
          <ToolInvocation />
        </GalleryCard>

        <GalleryCard name="BrainActivity">
          <BrainActivity
            regions={[
              { name: "Reasoning", activity: 92 },
              { name: "Memory", activity: 65 },
              { name: "Creativity", activity: 40 },
              { name: "Analysis", activity: 78 },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="TokenStream">
          <TokenStream
            tokens={["The ", "agent ", "is ", "analyzing ", "your ", "request..."]}
            isStreaming
            speed={80}
          />
        </GalleryCard>

        <GalleryCard name="MessageBubble">
          <div className="flex flex-col gap-2">
            <MessageBubble content="Deploy the staging env" sender="User" isOwn />
            <MessageBubble content="Deploying to staging now..." sender="Agent" />
          </div>
        </GalleryCard>

        <GalleryCard name="VectorCluster">
          <VectorCluster
            width={200}
            height={140}
            points={[
              { x: 1, y: 2, cluster: 0, label: "embed-a" },
              { x: 1.5, y: 2.2, cluster: 0 },
              { x: 4, y: 5, cluster: 1, label: "embed-b" },
              { x: 4.3, y: 4.8, cluster: 1 },
              { x: 7, y: 1, cluster: 2, label: "embed-c" },
              { x: 7.2, y: 1.5, cluster: 2 },
            ]}
          />
        </GalleryCard>
      </div>
    </div>
  );
}
