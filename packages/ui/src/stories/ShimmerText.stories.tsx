// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShimmerText } from "../components/ui/shimmer-text";

/**
 * ShimmerText - Animated text with ethereal glow using layered text.
 * 
 * Uses 3 identical text layers stacked on top of each other:
 * - Top layer: crisp, visible text
 * - Middle/bottom layers: blurred, slightly offset, animating with Framer Motion
 * 
 * Creates a soft, glowy, ethereal sheen effect - not huge background blobs,
 * just vibey glowing text.
 */
const meta = {
  title: "Components/ShimmerText",
  component: ShimmerText,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
    docs: {
      description: {
        component:
          "Animated text with ethereal glow using layered text. Perfect for hero headlines.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl"],
      description: "Text size variant",
    },
    color: {
      control: "select",
      options: ["cyan", "purple", "yellow", "green", "white"],
      description: "Base color theme for text and glow",
    },
    glow: {
      control: "boolean",
      description: "Enable glow effect",
    },
    glowSpeed: {
      control: { type: "range", min: 6, max: 30, step: 1 },
      description: "Glow animation speed (seconds) - higher = slower",
    },
    glowIntensity: {
      control: { type: "range", min: 0.3, max: 2, step: 0.1 },
      description: "Glow intensity - affects blur and offset distance",
    },
    glowBrightness: {
      control: { type: "range", min: 0.5, max: 2, step: 0.1 },
      description: "Glow brightness - affects opacity and lightness",
    },
    textShadow: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Text shadow intensity (0 = none)",
    },
  },
} satisfies Meta<typeof ShimmerText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ethereal glow.
 */
export const Default: Story = {
  args: {
    children: "SKYNET DESIGN",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1,
  },
};

/**
 * Intense glow with higher intensity.
 */
export const IntenseGlow: Story = {
  args: {
    children: "POWER MODE",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 10,
    glowIntensity: 1.5,
  },
};

/**
 * Slow, subtle atmospheric glow.
 */
export const SlowAtmospheric: Story = {
  args: {
    children: "ATMOSPHERIC",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 20,
    glowIntensity: 0.8,
  },
};

/**
 * Fast shimmer for energetic feel.
 */
export const FastShimmer: Story = {
  args: {
    children: "ENERGIZED",
    size: "xl",
    color: "cyan",
    glow: true,
    glowSpeed: 6,
    glowIntensity: 1.2,
  },
};

/**
 * Purple ethereal variant.
 */
export const PurpleEthereal: Story = {
  args: {
    children: "NEURAL ACTIVE",
    size: "xl",
    color: "purple",
    glow: true,
    glowSpeed: 14,
    glowIntensity: 1,
  },
};

/**
 * Yellow/gold warning aesthetic.
 */
export const GoldenWarning: Story = {
  args: {
    children: "CAUTION",
    size: "xl",
    color: "yellow",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1,
  },
};

/**
 * Green system active.
 */
export const SystemActive: Story = {
  args: {
    children: "ONLINE",
    size: "xl",
    color: "green",
    glow: true,
    glowSpeed: 12,
    glowIntensity: 1,
  },
};

/**
 * No glow - plain text.
 */
export const NoGlow: Story = {
  args: {
    children: "PLAIN TEXT",
    size: "xl",
    color: "cyan",
    glow: false,
  },
};

/**
 * Extra large 2xl size.
 */
export const ExtraLarge: Story = {
  args: {
    children: "MASSIVE",
    size: "2xl",
    color: "cyan",
    glow: true,
    glowSpeed: 16,
    glowIntensity: 1.2,
  },
};

/**
 * All color variants.
 */
export const AllColors: Story = {
  args: {
    children: "COLOR DEMO",
  },
  render: () => (
    <div className="flex flex-col items-center gap-16 py-8">
      <ShimmerText size="lg" color="cyan" glowSpeed={12}>
        CYBER CYAN
      </ShimmerText>
      <ShimmerText size="lg" color="purple" glowSpeed={14}>
        CYBER PURPLE
      </ShimmerText>
      <ShimmerText size="lg" color="yellow" glowSpeed={12}>
        CYBER YELLOW
      </ShimmerText>
      <ShimmerText size="lg" color="green" glowSpeed={12}>
        CYBER GREEN
      </ShimmerText>
      <ShimmerText size="lg" color="white" glowSpeed={14}>
        PURE WHITE
      </ShimmerText>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

/**
 * Size comparison.
 */
export const AllSizes: Story = {
  args: {
    children: "SIZE DEMO",
  },
  render: () => (
    <div className="flex flex-col items-center gap-14 py-8">
      <ShimmerText size="sm" color="cyan">SMALL</ShimmerText>
      <ShimmerText size="md" color="cyan">MEDIUM</ShimmerText>
      <ShimmerText size="lg" color="cyan">LARGE</ShimmerText>
      <ShimmerText size="xl" color="cyan">EXTRA LARGE</ShimmerText>
      <ShimmerText size="2xl" color="cyan">2X LARGE</ShimmerText>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

/**
 * Glow intensity comparison.
 */
export const GlowIntensityLevels: Story = {
  args: {
    children: "INTENSITY DEMO",
  },
  render: () => (
    <div className="flex flex-col items-center gap-16 py-8">
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">0.5 - Subtle</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={0.5}>
          SUBTLE GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">1.0 - Default</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={1.0}>
          DEFAULT GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">1.5 - Intense</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={1.5}>
          INTENSE GLOW
        </ShimmerText>
      </div>
      <div className="text-center">
        <p className="text-xs font-mono text-muted-foreground mb-6">2.0 - Maximum</p>
        <ShimmerText size="lg" color="cyan" glowIntensity={2.0}>
          MAXIMUM GLOW
        </ShimmerText>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

/**
 * Hero headline example.
 */
export const HeroExample: Story = {
  args: {
    children: "HERO DEMO",
  },
  render: () => (
    <div className="text-center space-y-8 py-16 px-8">
      <ShimmerText 
        size="2xl" 
        color="cyan"
        glowSpeed={14}
        glowIntensity={1.1}
      >
        SKYNET DESIGN SYSTEM
      </ShimmerText>
      <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
        Cyberpunk/Military Tactical Aesthetic for High-Performance Interfaces
      </p>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
