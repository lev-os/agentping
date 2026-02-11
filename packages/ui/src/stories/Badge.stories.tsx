import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/ui/badge";

/**
 * Badge component with SKYNET styling variants.
 * Used for status indicators, labels, and tags with cyberpunk aesthetics.
 */
const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A badge component with SKYNET cyberpunk styling. Features monospace typography, uppercase text, and color-coded variants for status indication.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "success", "warning", "destructive", "outline", "ghost"],
      description: "The visual style variant",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "ACTIVE",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "STANDBY",
    variant: "secondary",
  },
};

export const Success: Story = {
  args: {
    children: "ONLINE",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "CAUTION",
    variant: "warning",
  },
};

export const Destructive: Story = {
  args: {
    children: "CRITICAL",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "NEUTRAL",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "DISABLED",
    variant: "ghost",
  },
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SYSTEM STATUS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">OPERATIONAL</Badge>
          <Badge variant="warning">MAINTENANCE</Badge>
          <Badge variant="destructive">OFFLINE</Badge>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">MISSION STATUS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">IN PROGRESS</Badge>
          <Badge variant="success">COMPLETED</Badge>
          <Badge variant="warning">PENDING</Badge>
          <Badge variant="destructive">ABORTED</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const FlightPhases: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">FLIGHT PHASES</h3>
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">TAXI</Badge>
        <Badge variant="default">TAKEOFF</Badge>
        <Badge variant="success">CRUISE</Badge>
        <Badge variant="warning">APPROACH</Badge>
        <Badge variant="default">LANDING</Badge>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const TrainingLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">CURRICULUM LEVELS</h3>
      <div className="grid grid-cols-3 gap-2 max-w-md">
        {["LVL 01", "LVL 02", "LVL 03", "LVL 04", "LVL 05", "LVL 06"].map((level, i) => (
          <Badge key={level} variant={i < 3 ? "success" : i < 5 ? "default" : "outline"}>
            {level} {i < 3 ? "COMPLETE" : i < 5 ? "ACTIVE" : "LOCKED"}
          </Badge>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AlertLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-lg text-foreground">ALERT LEVELS</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Badge variant="success">CONDITION GREEN</Badge>
          <span className="text-sm text-muted-foreground">All systems nominal</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning">CONDITION YELLOW</Badge>
          <span className="text-sm text-muted-foreground">Elevated awareness</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive">CONDITION RED</Badge>
          <span className="text-sm text-muted-foreground">Emergency protocols active</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">ALL VARIANTS</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">DEFAULT</Badge>
          <Badge variant="secondary">SECONDARY</Badge>
          <Badge variant="success">SUCCESS</Badge>
          <Badge variant="warning">WARNING</Badge>
          <Badge variant="destructive">DESTRUCTIVE</Badge>
          <Badge variant="outline">OUTLINE</Badge>
          <Badge variant="ghost">GHOST</Badge>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">IN CONTEXT</h3>
        <div className="flex items-center gap-4 p-4 border border-border bg-card/50">
          <span className="font-mono text-sm text-foreground">SOFIA v2.4.1</span>
          <Badge variant="success">STABLE</Badge>
          <Badge variant="default">PPO</Badge>
          <Badge variant="secondary">AWBC</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
