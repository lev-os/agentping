import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlowOrb } from "../components/ui/glow-orb";

/**
 * GlowOrb - Atmospheric blurry circle for background effects.
 * 
 * Creates ambient lighting effects using large, heavily blurred circles.
 * Combine with blend modes for layered depth and atmosphere.
 * 
 * Use for:
 * - Hero section backgrounds
 * - Card hover states
 * - Ambient mood lighting
 * - Focus indicators
 */
const meta: Meta<typeof GlowOrb> = {
  title: "Components/GlowOrb",
  component: GlowOrb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Atmospheric blurry circle component for creating ambient background effects. Supports blend modes and pulse animations.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description: "Size of the glow orb",
    },
    color: {
      control: "select",
      options: ["cyan", "purple", "yellow", "green", "red", "orange"],
      description: "Color of the glow",
    },
    intensity: {
      control: "select",
      options: ["subtle", "low", "medium", "high", "intense"],
      description: "Opacity/intensity level",
    },
    blur: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description: "Blur amount",
    },
    blendMode: {
      control: "select",
      options: ["normal", "screen", "overlay", "soft-light", "color-dodge", "multiply"],
      description: "CSS blend mode",
    },
    pulse: {
      control: "boolean",
      description: "Enable pulse animation",
    },
    pulseDuration: {
      control: { type: "range", min: 4, max: 24, step: 2 },
      description: "Pulse animation duration in seconds",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative w-[600px] h-[400px] bg-background border border-border overflow-hidden">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-xs text-muted-foreground">
            PREVIEW CONTAINER
          </span>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "lg",
    color: "cyan",
    intensity: "medium",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "screen",
  },
};

export const Cyan: Story = {
  args: {
    size: "xl",
    color: "cyan",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen",
  },
};

export const Purple: Story = {
  args: {
    size: "xl",
    color: "purple",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen",
  },
};

export const Yellow: Story = {
  args: {
    size: "lg",
    color: "yellow",
    intensity: "low",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "screen",
  },
};

export const WithPulse: Story = {
  args: {
    size: "xl",
    color: "cyan",
    intensity: "medium",
    blur: "xl",
    x: "50%",
    y: "50%",
    blendMode: "screen",
    pulse: true,
    pulseDuration: 8,
  },
};

export const ColorDodge: Story = {
  args: {
    size: "lg",
    color: "cyan",
    intensity: "low",
    blur: "lg",
    x: "50%",
    y: "50%",
    blendMode: "color-dodge",
  },
};

export const MultipleOrbs: Story = {
  render: () => (
    <>
      <GlowOrb
        color="cyan"
        size="xl"
        intensity="medium"
        blur="xl"
        x="30%"
        y="40%"
        blendMode="screen"
      />
      <GlowOrb
        color="purple"
        size="lg"
        intensity="low"
        blur="lg"
        x="70%"
        y="60%"
        blendMode="screen"
      />
      <GlowOrb
        color="yellow"
        size="md"
        intensity="subtle"
        blur="lg"
        x="50%"
        y="30%"
        blendMode="color-dodge"
      />
    </>
  ),
};

export const AnimatedComposition: Story = {
  render: () => (
    <>
      <GlowOrb
        color="cyan"
        size="2xl"
        intensity="low"
        blur="2xl"
        x="25%"
        y="35%"
        blendMode="screen"
        pulse
        pulseDuration={12}
      />
      <GlowOrb
        color="purple"
        size="xl"
        intensity="subtle"
        blur="2xl"
        x="75%"
        y="65%"
        blendMode="screen"
        pulse
        pulseDuration={16}
      />
    </>
  ),
};

export const IntensityLevels: Story = {
  render: () => (
    <div className="flex gap-4">
      {["subtle", "low", "medium", "high", "intense"].map((intensity, i) => (
        <div key={intensity} className="relative w-24 h-24">
          <GlowOrb
            color="cyan"
            size="md"
            intensity={intensity as "subtle" | "low" | "medium" | "high" | "intense"}
            blur="md"
            x="50%"
            y="50%"
          />
          <span className="absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground">
            {intensity}
          </span>
        </div>
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="relative w-[600px] h-[200px] bg-background border border-border overflow-hidden flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      {["cyan", "purple", "yellow", "green", "red", "orange"].map((color) => (
        <div key={color} className="relative w-32 h-32">
          <GlowOrb
            color={color as "cyan" | "purple" | "yellow" | "green" | "red" | "orange"}
            size="lg"
            intensity="medium"
            blur="lg"
            x="50%"
            y="50%"
            blendMode="screen"
          />
          <span className="absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] text-muted-foreground">
            {color}
          </span>
        </div>
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="relative w-[500px] h-[300px] bg-background border border-border overflow-hidden flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

