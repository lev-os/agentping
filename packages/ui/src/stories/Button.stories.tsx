// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/ui/button";

/**
 * Button component with SKYNET styling variants.
 * Sharp edges, glow effects, and tactical aesthetics.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A button component with SKYNET cyberpunk styling. Features sharp edges, glow effects, and multiple variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "The visual style variant",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element for composition",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "ENGAGE",
    variant: "default",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "STANDBY",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "ABORT MISSION",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "CONFIGURE",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "DISMISS",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "VIEW DETAILS",
    variant: "link",
  },
};

export const Small: Story = {
  args: {
    children: "CONFIRM",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "INITIALIZE SYSTEM",
    size: "lg",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">VARIANTS</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">DEFAULT</Button>
          <Button variant="secondary">SECONDARY</Button>
          <Button variant="destructive">DESTRUCTIVE</Button>
          <Button variant="outline">OUTLINE</Button>
          <Button variant="ghost">GHOST</Button>
          <Button variant="link">LINK</Button>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">SIZES</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">SMALL</Button>
          <Button size="default">DEFAULT</Button>
          <Button size="lg">LARGE</Button>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATES</h3>
        <div className="flex flex-wrap gap-4">
          <Button>ENABLED</Button>
          <Button disabled>DISABLED</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
