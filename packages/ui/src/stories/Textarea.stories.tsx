// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { useState } from "react";

/**
 * Textarea component with SKYNET styling.
 * Multi-line text input with sharp edges and tactical aesthetics.
 */
const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A multi-line text input component with SKYNET cyberpunk styling. Features sharp edges, focused ring states, and supports error states for validation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when empty",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether to show error styling",
    },
    rows: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of visible text lines",
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter mission notes here...",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const WithValue: Story = {
  args: {
    defaultValue: "Training session completed successfully. Model achieved 95% accuracy on level 12 maneuvers.",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const SmallRows: Story = {
  args: {
    placeholder: "Brief note...",
    rows: 2,
    className: "min-h-0",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const MediumRows: Story = {
  args: {
    placeholder: "Standard input area...",
    rows: 4,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const LargeRows: Story = {
  args: {
    placeholder: "Extended text area for detailed reports...",
    rows: 8,
    className: "min-h-[200px]",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    placeholder: "This field is disabled",
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const DisabledWithValue: Story = {
  args: {
    defaultValue: "System-generated log entry. Read-only content.",
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const ErrorState: Story = {
  args: {
    placeholder: "Enter required information...",
    error: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const ErrorWithValue: Story = {
  args: {
    defaultValue: "Invalid input data",
    error: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="notes" className="font-mono text-xs text-muted-foreground">
        MISSION NOTES
      </Label>
      <Textarea id="notes" placeholder="Enter mission notes..." />
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="briefing" className="font-mono text-xs text-muted-foreground">
        PRE-FLIGHT BRIEFING
      </Label>
      <Textarea
        id="briefing"
        placeholder="Enter briefing details..."
        rows={5}
        className="min-h-[120px]"
      />
      <p className="text-xs text-muted-foreground">
        Include weather conditions, route, and special considerations.
      </p>
    </div>
  ),
};

const CharacterCountDemo = () => {
  const [value, setValue] = useState("");
  const maxLength = 500;
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 50;
  const isOverLimit = remaining < 0;

  return (
    <div className="w-[400px] space-y-2">
      <Label htmlFor="limited" className="font-mono text-xs text-muted-foreground">
        FLIGHT REPORT
      </Label>
      <Textarea
        id="limited"
        placeholder="Enter flight report details..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={isOverLimit}
        rows={5}
        className="min-h-[120px]"
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Maximum 500 characters
        </p>
        <span
          className={`text-xs font-mono ${
            isOverLimit
              ? "text-destructive"
              : isNearLimit
              ? "text-yellow-500"
              : "text-muted-foreground"
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export const WithCharacterCount: Story = {
  render: () => <CharacterCountDemo />,
};

export const FlightNotes: Story = {
  render: () => (
    <div className="w-[450px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">FLIGHT NOTES</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            PILOT OBSERVATIONS
          </Label>
          <Textarea
            placeholder="Enter observations during flight..."
            defaultValue="Smooth takeoff at 0800 local. Encountered light turbulence at FL350. Autopilot performed well during cruise phase."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            SYSTEM ANOMALIES
          </Label>
          <Textarea
            placeholder="Report any system anomalies..."
            rows={2}
            className="min-h-0"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const IncidentReport: Story = {
  render: () => (
    <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm text-destructive">INCIDENT REPORT</h3>
        <span className="text-xs font-mono text-muted-foreground">FORM IR-2024</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            INCIDENT DESCRIPTION
          </Label>
          <Textarea
            placeholder="Describe the incident in detail..."
            rows={4}
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">
              IMMEDIATE ACTIONS TAKEN
            </Label>
            <Textarea
              placeholder="Actions taken..."
              rows={3}
              className="min-h-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">
              CONTRIBUTING FACTORS
            </Label>
            <Textarea
              placeholder="Contributing factors..."
              rows={3}
              className="min-h-0"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            RECOMMENDATIONS
          </Label>
          <Textarea
            placeholder="Enter recommendations for prevention..."
            rows={3}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const BriefingNotes: Story = {
  render: () => (
    <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">PRE-FLIGHT BRIEFING</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            WEATHER CONDITIONS
          </Label>
          <Textarea
            defaultValue="METAR KJFK 121756Z 31015G22KT 10SM FEW040 SCT250 22/12 A3012"
            rows={3}
            className="min-h-0 font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-muted-foreground">
            NOTAMS
          </Label>
          <Textarea
            defaultValue="RWY 04L/22R CLSD FOR MAINT. TWY B BTN TWY A AND TWY C CLSD."
            rows={3}
            className="min-h-0 font-mono text-xs"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          ROUTE NOTES
        </Label>
        <Textarea
          placeholder="Enter route-specific notes..."
          defaultValue="Direct MERIT, V229 ALB, V2 BOSTN. Expect FL350. Monitor 125.77 for traffic advisories in Boston area."
          rows={2}
          className="min-h-0"
        />
      </div>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          SPECIAL CONSIDERATIONS
        </Label>
        <Textarea
          placeholder="Any special considerations..."
          rows={2}
          className="min-h-0"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const TrainingLog: Story = {
  render: () => {
    const [log, setLog] = useState(
`[14:23:45] Session started - Level 12: Crosswind Landing
[14:24:12] Wind conditions: 15kt gusting 22kt, 30° crosswind
[14:25:33] Approach initiated - IAS 85kt, flaps 20°
[14:26:01] Crab angle established: 12° into wind
[14:26:45] Short final - transition to wing-low
[14:27:02] Touchdown - Success! Score: 92/100
[14:27:15] Session completed`
    );

    return (
      <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm text-primary">TRAINING LOG</h3>
          <span className="text-xs font-mono text-green-400">LIVE</span>
        </div>
        <Textarea
          value={log}
          onChange={(e) => setLog(e.target.value)}
          rows={10}
          className="min-h-[250px] font-mono text-xs bg-black/50"
        />
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Session: 00:03:30</span>
          <span>Lines: {log.split('\n').length}</span>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const SystemConfiguration: Story = {
  render: () => (
    <div className="w-[500px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM CONFIGURATION</h3>
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">
          CONFIG YAML
        </Label>
        <Textarea
          defaultValue={`training:
  learning_rate: 3e-4
  batch_size: 64
  n_envs: 8
  features:
    - behavioral_cloning
    - hindsight_experience
    - curiosity
  curriculum:
    start_level: 1
    max_level: 35`}
          rows={12}
          className="min-h-[280px] font-mono text-xs"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const FormValidation: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [touched, setTouched] = useState(false);
    const hasError = touched && value.length < 10;

    return (
      <div className="w-[400px] space-y-2">
        <Label
          htmlFor="validation"
          className={`font-mono text-xs ${hasError ? "text-destructive" : "text-muted-foreground"}`}
        >
          DESCRIPTION (Required)
        </Label>
        <Textarea
          id="validation"
          placeholder="Enter at least 10 characters..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          error={hasError}
        />
        {hasError && (
          <p className="text-xs text-destructive">
            Description must be at least 10 characters
          </p>
        )}
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-[600px] space-y-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">TEXTAREA STATES</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DEFAULT</Label>
            <Textarea placeholder="Default textarea..." />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">WITH VALUE</Label>
            <Textarea defaultValue="Pre-filled content here" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DISABLED</Label>
            <Textarea placeholder="Disabled textarea" disabled />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">DISABLED WITH VALUE</Label>
            <Textarea defaultValue="Read-only content" disabled />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-destructive">ERROR STATE</Label>
            <Textarea placeholder="Error state..." error />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-destructive">ERROR WITH VALUE</Label>
            <Textarea defaultValue="Invalid data entered" error />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SIZE VARIANTS</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">COMPACT (2 rows)</Label>
            <Textarea placeholder="Compact input..." rows={2} className="min-h-0" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">STANDARD (4 rows)</Label>
            <Textarea placeholder="Standard input..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">EXPANDED (8 rows)</Label>
            <Textarea placeholder="Expanded input..." rows={8} className="min-h-[200px]" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
