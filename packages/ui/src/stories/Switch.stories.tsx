// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../components/ui/switch";
import { useState } from "react";

/**
 * Switch component with SKYNET styling.
 * Toggle control with sharp edges and tactical aesthetics.
 */
const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A toggle switch component with SKYNET cyberpunk styling. Features sharp edges, glowing states, and smooth transitions.",
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
      description: "Whether the switch is disabled",
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback when checked state changes",
    },
  },
} satisfies Meta<typeof Switch>;

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

const ControlledSwitchDemo = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Switch checked={checked} onCheckedChange={setChecked} />
      <span className="text-sm font-mono text-muted-foreground">
        {checked ? "ENABLED" : "DISABLED"}
      </span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSwitchDemo />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="autopilot" defaultChecked />
      <label htmlFor="autopilot" className="text-sm font-mono text-foreground cursor-pointer">
        AUTOPILOT
      </label>
    </div>
  ),
};

export const FeatureToggles: Story = {
  render: () => {
    const [features, setFeatures] = useState({
      bc: true,
      her: true,
      curiosity: false,
      worldModel: false,
      pbt: false,
    });

    const toggleFeature = (key: keyof typeof features) => {
      setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[350px] space-y-4">
        <h3 className="font-display text-lg text-foreground">TRAINING FEATURES</h3>
        <div className="space-y-3 p-4 border border-border bg-card/50">
          {[
            { key: "bc" as const, label: "BEHAVIORAL CLONING", desc: "Self-imitation learning" },
            { key: "her" as const, label: "HINDSIGHT EXPERIENCE", desc: "Goal relabeling" },
            { key: "curiosity" as const, label: "CURIOSITY", desc: "Intrinsic exploration" },
            { key: "worldModel" as const, label: "WORLD MODEL", desc: "DreamerV3 imagination" },
            { key: "pbt" as const, label: "PBT", desc: "Population training" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-mono text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <Switch checked={features[key]} onCheckedChange={() => toggleFeature(key)} />
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const SystemControls: Story = {
  render: () => {
    const [controls, setControls] = useState({
      autopilot: false,
      recording: false,
      safety: true,
      vecNormalize: true,
    });

    const toggleControl = (key: keyof typeof controls) => {
      setControls((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="font-display text-lg text-foreground">SYSTEM CONTROLS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">AUTOPILOT</span>
              <Switch
                checked={controls.autopilot}
                onCheckedChange={() => toggleControl("autopilot")}
              />
            </div>
            <div
              className={`text-lg font-mono ${controls.autopilot ? "text-primary" : "text-muted-foreground"}`}
            >
              {controls.autopilot ? "ENGAGED" : "STANDBY"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">RECORDING</span>
              <Switch
                checked={controls.recording}
                onCheckedChange={() => toggleControl("recording")}
              />
            </div>
            <div
              className={`text-lg font-mono ${controls.recording ? "text-red-400" : "text-muted-foreground"}`}
            >
              {controls.recording ? "RECORDING" : "IDLE"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">SAFETY</span>
              <Switch checked={controls.safety} onCheckedChange={() => toggleControl("safety")} />
            </div>
            <div
              className={`text-lg font-mono ${controls.safety ? "text-green-400" : "text-yellow-400"}`}
            >
              {controls.safety ? "ACTIVE" : "BYPASSED"}
            </div>
          </div>

          <div className="p-4 border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">VEC NORM</span>
              <Switch
                checked={controls.vecNormalize}
                onCheckedChange={() => toggleControl("vecNormalize")}
              />
            </div>
            <div
              className={`text-lg font-mono ${controls.vecNormalize ? "text-primary" : "text-muted-foreground"}`}
            >
              {controls.vecNormalize ? "ON" : "OFF"}
            </div>
          </div>
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
      <h3 className="font-display text-sm text-primary">PREFERENCES</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Use dark color scheme</div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Sound Effects</div>
            <div className="text-xs text-muted-foreground">Play UI sounds</div>
          </div>
          <Switch defaultChecked={false} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground">Auto-save</div>
            <div className="text-xs text-muted-foreground">Save checkpoints automatically</div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-foreground text-muted-foreground">Beta Features</div>
            <div className="text-xs text-muted-foreground">Currently unavailable</div>
          </div>
          <Switch disabled />
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
        <h3 className="font-display text-lg text-foreground mb-4">SWITCH STATES</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Switch defaultChecked={false} />
            <span className="text-sm font-mono text-muted-foreground">UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">CHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch disabled />
            <span className="text-sm font-mono text-muted-foreground">DISABLED UNCHECKED</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch disabled defaultChecked />
            <span className="text-sm font-mono text-muted-foreground">DISABLED CHECKED</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
