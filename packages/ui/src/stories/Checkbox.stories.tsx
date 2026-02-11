import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { useState } from "react";

/**
 * Checkbox component with SKYNET styling.
 * Toggle control for binary selections with sharp edges and tactical aesthetics.
 */
const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A checkbox component with SKYNET cyberpunk styling. Features sharp edges, glowing states, and smooth transitions for binary selections.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "The controlled checked state",
    },
    defaultChecked: {
      control: "boolean",
      description: "The default checked state (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback when checked state changes",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="autopilot-engage" defaultChecked />
      <Label htmlFor="autopilot-engage" className="font-mono text-foreground cursor-pointer">
        ENGAGE AUTOPILOT
      </Label>
    </div>
  ),
};

const ControlledCheckboxDemo = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
      <span className="text-sm font-mono text-muted-foreground">
        {checked ? "ACTIVE" : "INACTIVE"}
      </span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledCheckboxDemo />,
};

export const FormExample: Story = {
  render: () => {
    const [selections, setSelections] = useState({
      preflightCheck: false,
      weatherBriefing: false,
      fuelCalculation: false,
      weightBalance: false,
      notams: false,
    });

    const toggleSelection = (key: keyof typeof selections) => {
      setSelections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecked = Object.values(selections).every(Boolean);
    const someChecked = Object.values(selections).some(Boolean);

    return (
      <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">PRE-FLIGHT CHECKLIST</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[
            { key: "preflightCheck" as const, label: "PREFLIGHT INSPECTION" },
            { key: "weatherBriefing" as const, label: "WEATHER BRIEFING" },
            { key: "fuelCalculation" as const, label: "FUEL CALCULATION" },
            { key: "weightBalance" as const, label: "WEIGHT & BALANCE" },
            { key: "notams" as const, label: "NOTAMS REVIEWED" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                id={key}
                checked={selections[key]}
                onCheckedChange={() => toggleSelection(key)}
              />
              <Label
                htmlFor={key}
                className={`font-mono text-sm cursor-pointer ${
                  selections[key] ? "text-primary" : "text-foreground"
                }`}
              >
                {label}
              </Label>
            </div>
          ))}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <Checkbox
                id="all-complete"
                checked={allChecked}
                onCheckedChange={() => {
                  const newValue = !allChecked;
                  setSelections({
                    preflightCheck: newValue,
                    weatherBriefing: newValue,
                    fuelCalculation: newValue,
                    weightBalance: newValue,
                    notams: newValue,
                  });
                }}
                className={someChecked && !allChecked ? "data-[state=unchecked]:bg-primary/30" : ""}
              />
              <Label htmlFor="all-complete" className="font-mono text-sm text-foreground cursor-pointer">
                {allChecked ? "ALL COMPLETE" : "SELECT ALL"}
              </Label>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          STATUS: {allChecked ? "CLEARED FOR DEPARTURE" : `${Object.values(selections).filter(Boolean).length}/5 ITEMS VERIFIED`}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const TrainingFeatures: Story = {
  render: () => {
    const [features, setFeatures] = useState({
      bc: true,
      her: true,
      curiosity: false,
      worldModel: false,
      pbt: false,
      ewc: false,
    });

    const toggleFeature = (key: keyof typeof features) => {
      setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="font-display text-lg text-foreground">ADVANCED RL FEATURES</h3>
        <div className="grid grid-cols-2 gap-4 p-4 border border-border bg-card/50">
          {[
            { key: "bc" as const, label: "BEHAVIORAL CLONING", desc: "AWBC self-imitation" },
            { key: "her" as const, label: "HER", desc: "Hindsight goal relabeling" },
            { key: "curiosity" as const, label: "CURIOSITY", desc: "RND+ICM exploration" },
            { key: "worldModel" as const, label: "WORLD MODEL", desc: "DreamerV3 imagination" },
            { key: "pbt" as const, label: "PBT", desc: "Population training" },
            { key: "ewc" as const, label: "EWC", desc: "Elastic weight consolidation" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start gap-3">
              <Checkbox
                id={`feature-${key}`}
                checked={features[key]}
                onCheckedChange={() => toggleFeature(key)}
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor={`feature-${key}`}
                  className={`font-mono text-xs cursor-pointer block ${
                    features[key] ? "text-primary" : "text-foreground"
                  }`}
                >
                  {label}
                </Label>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          ACTIVE: {Object.values(features).filter(Boolean).length} MODULES ENABLED
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const SafetyChecks: Story = {
  render: () => {
    const [checks, setChecks] = useState({
      stallProtection: true,
      overspeedLimit: true,
      attitudeLimit: true,
      gLimit: true,
      altitudeFloor: false,
    });

    const toggleCheck = (key: keyof typeof checks) => {
      setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">SAFETY MONITOR CONFIG</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[
            { key: "stallProtection" as const, label: "STALL PROTECTION", critical: true },
            { key: "overspeedLimit" as const, label: "OVERSPEED LIMIT", critical: true },
            { key: "attitudeLimit" as const, label: "ATTITUDE LIMITS", critical: true },
            { key: "gLimit" as const, label: "G-FORCE LIMITS", critical: true },
            { key: "altitudeFloor" as const, label: "ALTITUDE FLOOR", critical: false },
          ].map(({ key, label, critical }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`safety-${key}`}
                  checked={checks[key]}
                  onCheckedChange={() => toggleCheck(key)}
                />
                <Label
                  htmlFor={`safety-${key}`}
                  className={`font-mono text-sm cursor-pointer ${
                    checks[key] ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {label}
                </Label>
              </div>
              {critical && (
                <span className="text-xs font-mono text-red-400">CRITICAL</span>
              )}
            </div>
          ))}
        </div>
        <div
          className={`text-xs font-mono ${
            Object.values(checks).every(Boolean) ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {Object.values(checks).every(Boolean)
            ? "ALL SAFETY SYSTEMS ACTIVE"
            : `WARNING: ${Object.values(checks).filter((v) => !v).length} PROTECTIONS DISABLED`}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const SettingsPanel: Story = {
  render: () => (
    <div className="w-[350px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM PREFERENCES</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox id="auto-save" defaultChecked />
          <div>
            <Label htmlFor="auto-save" className="text-sm text-foreground cursor-pointer block">
              Auto-save Checkpoints
            </Label>
            <span className="text-xs text-muted-foreground">Save training state periodically</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="vec-normalize" defaultChecked />
          <div>
            <Label htmlFor="vec-normalize" className="text-sm text-foreground cursor-pointer block">
              Vector Normalization
            </Label>
            <span className="text-xs text-muted-foreground">Normalize observations and rewards</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="recurrent" defaultChecked={false} />
          <div>
            <Label htmlFor="recurrent" className="text-sm text-foreground cursor-pointer block">
              Recurrent Memory
            </Label>
            <span className="text-xs text-muted-foreground">Use LSTM for temporal patterns</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="beta-features" disabled />
          <div>
            <Label
              htmlFor="beta-features"
              className="text-sm text-muted-foreground cursor-not-allowed block"
            >
              Beta Features
            </Label>
            <span className="text-xs text-muted-foreground">Currently unavailable</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">CHECKBOX STATES</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Checkbox defaultChecked={false} />
            <span className="text-sm font-mono text-muted-foreground">UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">CHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox disabled />
            <span className="text-sm font-mono text-muted-foreground">DISABLED UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox disabled defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">DISABLED CHECKED</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">WITH LABELS</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-1" />
            <Label htmlFor="label-demo-1" className="font-mono text-sm text-foreground cursor-pointer">
              STANDARD LABEL
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-2" defaultChecked />
            <Label htmlFor="label-demo-2" className="font-mono text-sm text-primary cursor-pointer">
              ACTIVE LABEL STYLE
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="label-demo-3" disabled />
            <Label
              htmlFor="label-demo-3"
              className="font-mono text-sm text-muted-foreground cursor-not-allowed"
            >
              DISABLED LABEL
            </Label>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
