"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { DraggableList } from "./draggable-list";
import { TransferList } from "./transfer-list";
import { SelectionList } from "./selection-list";
import { SplitView } from "./split-view";
import { CommandPalette } from "./command-palette";
import { QuickActions } from "./quick-actions";
import { WizardStep } from "./wizard-step";

export interface GalleryInteractionSectionProps { className?: string; }

const demoListItems = [
  { id: "1", content: <span className="text-xs font-mono text-cyan-300">Deploy service</span> },
  { id: "2", content: <span className="text-xs font-mono text-cyan-300">Run tests</span> },
  { id: "3", content: <span className="text-xs font-mono text-cyan-300">Build artifacts</span> },
];

const demoCommands = [
  { id: "c1", label: "Deploy to staging", shortcut: "Ctrl+D", action: () => {} },
  { id: "c2", label: "Run test suite", shortcut: "Ctrl+T", action: () => {} },
  { id: "c3", label: "Open terminal", shortcut: "Ctrl+`", action: () => {} },
];

const demoActions = [
  { id: "a1", label: "Deploy", icon: "\u25B6" },
  { id: "a2", label: "Rollback", icon: "\u21A9" },
  { id: "a3", label: "Logs", icon: "\u2630" },
  { id: "a4", label: "Scale", icon: "\u2195" },
];

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-mono text-cyan-400 border border-cyan-500/20 rounded px-3 py-1.5 hover:bg-cyan-500/10"
      >
        Open Palette (Ctrl+K)
      </button>
      <CommandPalette isOpen={open} onClose={() => setOpen(false)} commands={demoCommands} />
    </div>
  );
}

export function GalleryInteractionSection({ className }: GalleryInteractionSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Interaction Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="DraggableList">
          <DraggableList items={demoListItems} />
        </GalleryCard>
        <GalleryCard name="TransferList">
          <TransferList
            available={[
              { id: "a1", label: "Agent Alpha" },
              { id: "a2", label: "Agent Beta" },
            ]}
            selected={[
              { id: "s1", label: "Agent Gamma" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="SelectionList">
          <SelectionList
            items={[
              { id: "1", label: "Deploy pipeline", selected: true },
              { id: "2", label: "Run test suite", selected: false },
              { id: "3", label: "Build artifacts", selected: true },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="SplitView">
          <SplitView
            left={<div className="text-xs font-mono text-cyan-300 p-2">Left pane</div>}
            right={<div className="text-xs font-mono text-cyan-300 p-2">Right pane</div>}
            ratio={40}
          />
        </GalleryCard>
        <GalleryCard name="CommandPalette">
          <CommandPaletteDemo />
        </GalleryCard>
        <GalleryCard name="QuickActions">
          <QuickActions actions={demoActions} />
        </GalleryCard>
        <GalleryCard name="WizardStep">
          <WizardStep
            title="Configure Agent"
            description="Set up the agent parameters"
            stepNumber={2}
            totalSteps={4}
          >
            <div className="text-xs font-mono text-cyan-300">Agent config form goes here</div>
          </WizardStep>
        </GalleryCard>
      </div>
    </div>
  );
}
