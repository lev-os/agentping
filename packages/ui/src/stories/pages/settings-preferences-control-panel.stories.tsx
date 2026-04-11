import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { ToggleSwitch } from "../../components/migrations/toggle-switch";
import { Slider } from "../../components/migrations/slider";
import { ColorPicker } from "../../components/migrations/color-picker";
import { TagInput } from "../../components/migrations/tag-input";
import { SegmentedControl } from "../../components/migrations/segmented-control";
import { SecretInput } from "../../components/migrations/secret-input";
import { Knob } from "../../components/migrations/knob";
import { RangeSlider } from "../../components/migrations/range-slider";
import { PinInput } from "../../components/migrations/pin-input";
import { DatePicker } from "../../components/migrations/date-picker";
import { ThemeToggle } from "../../components/migrations/theme-toggle";
import { EditableText } from "../../components/migrations/editable-text";
import { SettingsModal } from "../../components/migrations/settings-modal";

/* ------------------------------------------------------------------ */
/* State & Helpers                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm text-cyan-400 uppercase tracking-widest font-mono">{title}</h2>
      <p className="text-[10px] text-cyan-500/40 mt-0.5">{description}</p>
    </div>
  );
}

function SettingsRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-cyan-500/5">
      <div>
        <div className="text-xs text-cyan-300">{label}</div>
        {description && <div className="text-[10px] text-cyan-500/30 mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function SettingsPreferencesControlPanel() {
  const [accentColor, setAccentColor] = useState("#00ffff");
  const [tags, setTags] = useState(["security", "devops", "monitoring"]);
  const [temperature, setTemperature] = useState(70);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [rateLimit, setRateLimit] = useState(60);
  const [modalOpen, setModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("SKYNET Operations Center");
  const [notifyDate, setNotifyDate] = useState("2026-03-01");

  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/10 bg-black/95 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm text-cyan-400 uppercase tracking-widest">System Settings</h1>
          <p className="text-[10px] text-cyan-500/40 mt-0.5">Configure runtime, appearance, and security preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme="dark" />
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 text-xs border border-cyan-500/20 rounded-md hover:bg-cyan-500/10 text-cyan-400"
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[200px_1fr] h-[calc(100vh-52px)]">
        {/* Sidebar nav */}
        <nav className="border-r border-cyan-500/10 bg-black/95 p-4 space-y-1">
          {["General", "Appearance", "Security", "Model Config", "Notifications", "Advanced"].map((s, i) => (
            <button
              key={s}
              className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                i === 0 ? "bg-cyan-500/10 text-cyan-300" : "text-cyan-500/40 hover:text-cyan-300 hover:bg-cyan-500/5"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 max-w-3xl">
          {/* General */}
          <section>
            <SectionHeader title="General" description="Workspace identity and core behavior" />
            <SettingsRow label="Workspace Name" description="Displayed in headers and notifications">
              <EditableText value={workspaceName} onChange={setWorkspaceName} />
            </SettingsRow>
            <SettingsRow label="Auto-save" description="Persist changes immediately">
              <ToggleSwitch checked={true} label="" />
            </SettingsRow>
            <SettingsRow label="Telemetry" description="Share anonymous usage data">
              <ToggleSwitch checked={false} label="" />
            </SettingsRow>
            <SettingsRow label="Update Channel" description="Release channel for updates">
              <SegmentedControl options={["Stable", "Beta", "Canary"]} selected="Stable" />
            </SettingsRow>
            <SettingsRow label="Agent Tags" description="Labels for filtering and routing">
              <TagInput tags={tags} onChange={setTags} placeholder="Add tag..." />
            </SettingsRow>
          </section>

          {/* Appearance */}
          <section>
            <SectionHeader title="Appearance" description="Visual customization and theme settings" />
            <SettingsRow label="Accent Color" description="Primary UI highlight color">
              <ColorPicker value={accentColor} onChange={setAccentColor} />
            </SettingsRow>
            <SettingsRow label="Font Size" description="Base font size in pixels">
              <RangeSlider min={10} max={24} value={14} label="Font Size" />
            </SettingsRow>
            <SettingsRow label="Animation Speed" description="UI transition velocity">
              <div className="flex items-center gap-4">
                <Knob value={temperature} min={0} max={100} onChange={setTemperature} size={48} label="Speed" unit="%" />
              </div>
            </SettingsRow>
            <SettingsRow label="Compact Mode" description="Reduce whitespace and padding">
              <ToggleSwitch checked={false} label="" />
            </SettingsRow>
          </section>

          {/* Security */}
          <section>
            <SectionHeader title="Security" description="Authentication and access controls" />
            <SettingsRow label="API Key" description="Primary authentication token">
              <SecretInput value="sk-ant-api03-xxxxxxxxxxxx" label="" />
            </SettingsRow>
            <SettingsRow label="2FA PIN" description="Two-factor authentication code">
              <PinInput length={6} label="" />
            </SettingsRow>
            <SettingsRow label="Session Timeout" description="Auto-lock after inactivity">
              <Slider min={5} max={120} value={30} step={5} label="Minutes" />
            </SettingsRow>
            <SettingsRow label="Require Approval" description="All tool uses need human approval">
              <ToggleSwitch checked={true} label="" />
            </SettingsRow>
          </section>

          {/* Model Config */}
          <section>
            <SectionHeader title="Model Configuration" description="LLM runtime parameters" />
            <SettingsRow label="Default Model" description="Primary model for agent tasks">
              <SegmentedControl options={["Opus", "Sonnet", "Haiku"]} selected="Opus" />
            </SettingsRow>
            <SettingsRow label="Temperature" description="Response creativity (0 = deterministic)">
              <Slider min={0} max={100} value={temperature} onChange={setTemperature} label="Temp" />
            </SettingsRow>
            <SettingsRow label="Max Tokens" description="Maximum output length per turn">
              <RangeSlider min={256} max={8192} value={maxTokens} onChange={setMaxTokens} label="Tokens" />
            </SettingsRow>
            <SettingsRow label="Rate Limit" description="Maximum requests per minute">
              <Knob value={rateLimit} min={1} max={200} onChange={setRateLimit} size={48} label="RPM" />
            </SettingsRow>
          </section>

          {/* Notifications */}
          <section>
            <SectionHeader title="Notifications" description="Alert and reminder configuration" />
            <SettingsRow label="Maintenance Window" description="Scheduled downtime date">
              <DatePicker value={notifyDate} onChange={(d) => setNotifyDate(d)} label="" />
            </SettingsRow>
            <SettingsRow label="Desktop Notifications" description="Show OS-level alerts">
              <ToggleSwitch checked={true} label="" />
            </SettingsRow>
            <SettingsRow label="Sound Effects" description="Audio feedback for events">
              <ToggleSwitch checked={false} label="" />
            </SettingsRow>
          </section>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        settings={{ model: "claude-opus-4-6", maxTurns: 25, autoApprove: false, temperature: 0.7 }}
        onSave={() => setModalOpen(false)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Pages/Settings & Preferences",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <SettingsPreferencesControlPanel />,
};
