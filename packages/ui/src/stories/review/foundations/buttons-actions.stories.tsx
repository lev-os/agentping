import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ReviewPageLayout } from "../_shared/ReviewPageLayout";
import { ComponentCard } from "../_shared/ComponentCard";
import { ComparePanel } from "../_shared/ComparePanel";
import type { ComponentMeta } from "../_shared/types";

import {
  ButtonStudioRaw,
  ButtonWebUiRaw,
  ButtonCandidate,
} from "../../../components/migrations/button-conflict";
import {
  IconButtonStudioRaw,
  IconButtonWebUiRaw,
  IconButtonCandidate,
} from "../../../components/migrations/icon-button-conflict";
import { ToggleSwitch } from "../../../components/migrations/toggle-switch";
import { SegmentedControl } from "../../../components/migrations/segmented-control";
import { CommandPalette } from "../../../components/migrations/command-palette";
import { QuickActions } from "../../../components/migrations/quick-actions";
import { DockMenu } from "../../../components/migrations/dock-menu";
import { RadialNav } from "../../../components/migrations/radial-nav";
import { CollapseButton } from "../../../components/migrations/collapse-button";
import { CopyButton } from "../../../components/migrations/copy-button";
import { LcarsButton } from "../../../components/migrations/lcars-button";

const meta: Meta = {
  title: "Review/Foundations/Buttons & Actions",
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
    family: "foundations/buttons-actions",
    domain,
    lanes: ["agentping"],
    beadId: "",
    storyPath: "Review/Foundations/Buttons & Actions",
    gateStatus,
    classification,
    markers: [],
  };
}

export const Overview: StoryObj = {
  render: () => (
    <ReviewPageLayout
      title="Buttons & Actions"
      category="Foundations"
      description="Buttons, icon buttons, toggles, segmented controls, command palettes, dock menus, and LCARS controls"
      componentCount={15}
    >
      {/* Conflict: Button */}
      <div className="mb-6">
        <ComparePanel
          title="Button (Conflict Family)"
          lanes={[
            {
              id: "btn-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: (
                <div className="flex flex-wrap gap-2">
                  <ButtonWebUiRaw label="Primary" tone="primary" />
                  <ButtonWebUiRaw label="Secondary" tone="secondary" />
                  <ButtonWebUiRaw label="Ghost" tone="ghost" />
                  <ButtonWebUiRaw label="Danger" tone="danger" />
                </div>
              ),
            },
            {
              id: "btn-studio",
              label: "Studio",
              variant: "sophia",
              content: (
                <div className="flex flex-wrap gap-2">
                  <ButtonStudioRaw label="Primary" tone="primary" />
                  <ButtonStudioRaw label="Secondary" tone="secondary" />
                  <ButtonStudioRaw label="Ghost" tone="ghost" />
                  <ButtonStudioRaw label="Danger" tone="danger" />
                </div>
              ),
            },
            {
              id: "btn-candidate",
              label: "Candidate",
              variant: "combined",
              content: (
                <div className="flex flex-wrap gap-2">
                  <ButtonCandidate label="Primary" tone="primary" />
                  <ButtonCandidate label="Secondary" tone="secondary" />
                  <ButtonCandidate label="Ghost" tone="ghost" />
                  <ButtonCandidate label="Danger" tone="danger" />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Conflict: IconButton */}
      <div className="mb-6">
        <ComparePanel
          title="IconButton (Conflict Family)"
          lanes={[
            {
              id: "ib-webui",
              label: "AgentPing (WebUI)",
              variant: "agentping",
              content: (
                <div className="flex gap-2">
                  <IconButtonWebUiRaw label="Settings" icon={<span>&#x2699;</span>} tone="neutral" />
                  <IconButtonWebUiRaw label="Add" icon={<span>+</span>} tone="primary" />
                  <IconButtonWebUiRaw label="Delete" icon={<span>&#x2716;</span>} tone="danger" />
                </div>
              ),
            },
            {
              id: "ib-studio",
              label: "Studio",
              variant: "sophia",
              content: (
                <div className="flex gap-2">
                  <IconButtonStudioRaw label="Settings" icon={<span>&#x2699;</span>} tone="neutral" />
                  <IconButtonStudioRaw label="Add" icon={<span>+</span>} tone="primary" />
                  <IconButtonStudioRaw label="Delete" icon={<span>&#x2716;</span>} tone="danger" />
                </div>
              ),
            },
            {
              id: "ib-candidate",
              label: "Candidate",
              variant: "combined",
              content: (
                <div className="flex gap-2">
                  <IconButtonCandidate label="Settings" icon={<span>&#x2699;</span>} tone="neutral" />
                  <IconButtonCandidate label="Add" icon={<span>+</span>} tone="primary" />
                  <IconButtonCandidate label="Delete" icon={<span>&#x2716;</span>} tone="danger" />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Regular Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard meta={m("toggle-switch", "ToggleSwitch")}>
          <div className="space-y-3">
            <ToggleSwitch checked={true} onChange={() => {}} label="Auto-sync" />
            <ToggleSwitch checked={false} onChange={() => {}} label="Dark mode" />
            <ToggleSwitch disabled label="Disabled" />
          </div>
        </ComponentCard>

        <ComponentCard meta={m("segmented-control", "SegmentedControl")}>
          <SegmentedControl
            options={["Daily", "Weekly", "Monthly"]}
            selected="Weekly"
          />
        </ComponentCard>

        <ComponentCard meta={m("command-palette", "CommandPalette", "needs-review")}>
          <CommandPalette
            isOpen={true}
            onClose={() => {}}
            commands={[
              { id: "1", label: "Open File", shortcut: "\u2318O", action: () => {} },
              { id: "2", label: "Search", shortcut: "\u2318K", action: () => {} },
              { id: "3", label: "Deploy Agent", shortcut: "\u2318D", action: () => {} },
              { id: "4", label: "View Logs", shortcut: "\u2318L", action: () => {} },
            ]}
          />
        </ComponentCard>

        <ComponentCard meta={m("quick-actions", "QuickActions")}>
          <QuickActions
            actions={[
              { id: "1", label: "Deploy", icon: "\uD83D\uDE80", shortcut: "\u2318D" },
              { id: "2", label: "Monitor", icon: "\uD83D\uDCCA" },
              { id: "3", label: "Rollback", icon: "\u23EE\uFE0F" },
              { id: "4", label: "Scale", icon: "\u2195\uFE0F" },
            ]}
          />
        </ComponentCard>

        <ComponentCard meta={m("dock-menu", "DockMenu")}>
          <DockMenu
            items={[
              { id: "home", label: "Home", icon: <span>&#x2302;</span> },
              { id: "search", label: "Search", icon: <span>&#x26B2;</span> },
              { id: "settings", label: "Settings", icon: <span>&#x2699;</span> },
              { id: "bell", label: "Alerts", icon: <span>&#x1F514;</span> },
            ]}
            onSelect={() => {}}
          />
        </ComponentCard>

        <ComponentCard meta={m("radial-nav", "RadialNav", "needs-review")}>
          <RadialNav
            size={160}
            items={[
              { id: "n", label: "North", icon: "N" },
              { id: "e", label: "East", icon: "E" },
              { id: "s", label: "South", icon: "S" },
              { id: "w", label: "West", icon: "W" },
              { id: "ne", label: "NE", icon: "\u2197" },
              { id: "se", label: "SE", icon: "\u2198" },
            ]}
          />
        </ComponentCard>

        <ComponentCard meta={m("collapse-button", "CollapseButton", "pass", "RE-EXPORT")}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CollapseButton isCollapsed={false} onToggle={() => {}} />
              <span className="text-xs text-cyan-500/60">Expanded</span>
            </div>
            <div className="flex items-center gap-2">
              <CollapseButton isCollapsed={true} onToggle={() => {}} />
              <span className="text-xs text-cyan-500/60">Collapsed</span>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard meta={m("copy-button", "CopyButton", "pass", "REAL", "studio")}>
          <div className="flex items-center gap-3">
            <CopyButton text="npm install @kingly/ui" />
            <span className="text-xs text-cyan-500/60">
              Copy: npm install @kingly/ui
            </span>
          </div>
        </ComponentCard>

        <ComponentCard meta={m("lcars-button", "LcarsButton")}>
          <div className="flex flex-wrap gap-2">
            <LcarsButton color="tan" endCap="left">SCAN</LcarsButton>
            <LcarsButton color="orange" endCap="none">ENGAGE</LcarsButton>
            <LcarsButton color="blue" endCap="right">WARP</LcarsButton>
            <LcarsButton color="red" endCap="both" size="sm">ALERT</LcarsButton>
          </div>
        </ComponentCard>
      </div>
    </ReviewPageLayout>
  ),
};
