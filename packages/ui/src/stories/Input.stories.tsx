import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

/**
 * Input component with SKYNET styling.
 * Supports various input types, error states, and aviation-themed data entry.
 */
const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A text input component with SKYNET cyberpunk styling. Features clean borders, focus rings, and error state handling for tactical data entry.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The HTML input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when empty",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether the input is in an error state",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter data...",
  },
};

export const WithPlaceholder: Story = {
  args: {
    type: "text",
    placeholder: "ENTER CALLSIGN",
  },
};

export const TypeEmail: Story = {
  args: {
    type: "email",
    placeholder: "pilot@skynet.mil",
  },
};

export const TypePassword: Story = {
  args: {
    type: "password",
    placeholder: "Enter access code",
  },
};

export const TypeNumber: Story = {
  args: {
    type: "number",
    placeholder: "0",
    className: "font-mono",
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "SYSTEM LOCKED",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    type: "text",
    placeholder: "Invalid input",
    error: true,
    defaultValue: "INVALID_DATA",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="callsign" className="text-xs uppercase tracking-wider text-muted-foreground">
        Pilot Callsign
      </Label>
      <Input id="callsign" type="text" placeholder="MAVERICK" />
    </div>
  ),
};

export const WithLabelAndError: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="altitude-err" className="text-xs uppercase tracking-wider text-muted-foreground">
        Target Altitude
      </Label>
      <Input
        id="altitude-err"
        type="number"
        error={true}
        defaultValue="99999"
        className="font-mono"
      />
      <span className="text-xs text-red-500">ALTITUDE EXCEEDS SERVICE CEILING</span>
    </div>
  ),
};

// Aviation-themed examples
export const TailNumber: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-48">
      <Label htmlFor="tail" className="text-xs uppercase tracking-wider text-muted-foreground">
        Aircraft Tail Number
      </Label>
      <Input
        id="tail"
        type="text"
        placeholder="N172SP"
        className="font-mono uppercase"
        maxLength={7}
      />
    </div>
  ),
};

export const AltitudeInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-40">
      <Label htmlFor="alt" className="text-xs uppercase tracking-wider text-muted-foreground">
        Altitude (ft)
      </Label>
      <Input
        id="alt"
        type="number"
        placeholder="3500"
        className="font-mono"
        min={0}
        max={18000}
        step={100}
      />
    </div>
  ),
};

export const HeadingInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="hdg" className="text-xs uppercase tracking-wider text-muted-foreground">
        Heading (deg)
      </Label>
      <Input
        id="hdg"
        type="number"
        placeholder="270"
        className="font-mono"
        min={0}
        max={359}
        step={1}
      />
    </div>
  ),
};

export const SpeedInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="speed" className="text-xs uppercase tracking-wider text-muted-foreground">
        IAS (kts)
      </Label>
      <Input
        id="speed"
        type="number"
        placeholder="120"
        className="font-mono"
        min={0}
        max={250}
        step={5}
      />
    </div>
  ),
};

export const FrequencyInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-40">
      <Label htmlFor="freq" className="text-xs uppercase tracking-wider text-muted-foreground">
        COM1 Frequency
      </Label>
      <Input
        id="freq"
        type="text"
        placeholder="121.500"
        className="font-mono"
        maxLength={7}
      />
    </div>
  ),
};

export const TransponderCode: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-32">
      <Label htmlFor="squawk" className="text-xs uppercase tracking-wider text-muted-foreground">
        Squawk Code
      </Label>
      <Input
        id="squawk"
        type="text"
        placeholder="1200"
        className="font-mono"
        maxLength={4}
        pattern="[0-7]{4}"
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">INPUT TYPES</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Text</Label>
            <Input type="text" placeholder="Text input" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" placeholder="email@skynet.mil" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input type="password" placeholder="Password" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Number</Label>
            <Input type="number" placeholder="0" className="w-40 font-mono" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATES</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Default</Label>
            <Input type="text" placeholder="Default" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Disabled</Label>
            <Input type="text" placeholder="Disabled" disabled className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Error</Label>
            <Input type="text" defaultValue="INVALID" error className="w-40" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">AVIATION DATA ENTRY</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tail #</Label>
            <Input type="text" placeholder="N172SP" className="w-28 font-mono uppercase" maxLength={7} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">ALT (ft)</Label>
            <Input type="number" placeholder="3500" className="w-24 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">HDG (deg)</Label>
            <Input type="number" placeholder="270" className="w-20 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">IAS (kts)</Label>
            <Input type="number" placeholder="120" className="w-20 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">COM1</Label>
            <Input type="text" placeholder="121.500" className="w-24 font-mono" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Squawk</Label>
            <Input type="text" placeholder="1200" className="w-20 font-mono" maxLength={4} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
