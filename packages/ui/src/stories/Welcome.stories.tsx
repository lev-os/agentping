import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

/**
 * SKYNET Design System - Comprehensive Design Guide
 *
 * This documentation showcases the complete SKYNET cyberpunk/military tactical aesthetic
 * used throughout the Sofia dashboard and Kingly applications.
 *
 * Key Characteristics:
 * - Dark backgrounds with cyan accents
 * - Sharp edges (zero border-radius)
 * - Neon glow effects
 * - Military/tactical typography
 * - Grid pattern overlays
 */

// Color palette data with CSS variables and values
const colorPalette = [
  {
    name: "Primary",
    cssVar: "--color-primary",
    hsl: "hsl(195 100% 50%)",
    hex: "#00BFFF",
    tailwind: "bg-primary",
    description: "Cyan - Primary actions, links, focus states",
  },
  {
    name: "Secondary",
    cssVar: "--color-secondary",
    hsl: "hsl(280 100% 60%)",
    hex: "#CC33FF",
    tailwind: "bg-secondary",
    description: "Purple - Secondary actions, accents",
  },
  {
    name: "Accent",
    cssVar: "--color-accent",
    hsl: "hsl(45 100% 50%)",
    hex: "#FFD700",
    tailwind: "bg-accent",
    description: "Yellow/Gold - Highlights, warnings",
  },
  {
    name: "Destructive",
    cssVar: "--color-destructive",
    hsl: "hsl(0 85% 55%)",
    hex: "#E63946",
    tailwind: "bg-destructive",
    description: "Red - Errors, critical alerts, danger",
  },
  {
    name: "Success",
    cssVar: "--color-success",
    hsl: "hsl(150 100% 45%)",
    hex: "#00E676",
    tailwind: "bg-success",
    description: "Green - Success states, online status",
  },
  {
    name: "Warning",
    cssVar: "--color-warning",
    hsl: "hsl(45 100% 50%)",
    hex: "#FFD700",
    tailwind: "bg-warning",
    description: "Amber - Caution, attention needed",
  },
  {
    name: "Background",
    cssVar: "--color-background",
    hsl: "hsl(220 20% 4%)",
    hex: "#080A0D",
    tailwind: "bg-background",
    description: "Deep dark - Page background",
  },
  {
    name: "Card",
    cssVar: "--color-card",
    hsl: "hsl(220 20% 8%)",
    hex: "#101318",
    tailwind: "bg-card",
    description: "Elevated dark - Card surfaces",
  },
  {
    name: "Muted",
    cssVar: "--color-muted",
    hsl: "hsl(220 15% 15%)",
    hex: "#212530",
    tailwind: "bg-muted",
    description: "Subtle dark - Disabled, inactive",
  },
  {
    name: "Border",
    cssVar: "--color-border",
    hsl: "hsl(195 40% 20%)",
    hex: "#1F4652",
    tailwind: "border-border",
    description: "Subtle cyan - Borders, dividers",
  },
];

const WelcomeComponent = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative py-20 px-8 text-center border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Badge variant="outline" className="mb-6 font-mono text-xs">
            v1.0.0 // OPERATIONAL
          </Badge>
          <h1 className="font-display text-6xl md:text-7xl text-primary text-glow-cyan mb-6 tracking-wider">
            SKYNET DESIGN SYSTEM
          </h1>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Cyberpunk/Military Tactical Aesthetic for High-Performance Mission Control Interfaces
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-primary/20 text-primary border-primary/50">
              ZERO RADIUS
            </Badge>
            <Badge className="bg-secondary/20 text-secondary border-secondary/50">
              NEON GLOW
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/50">
              GRID PATTERN
            </Badge>
            <Badge className="bg-success/20 text-success border-success/50">
              DARK MODE
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16 space-y-24">
        {/* Color Palette Section */}
        <section>
          <SectionHeader
            title="COLOR PALETTE"
            subtitle="Core colors with HSL values, hex codes, and CSS variables"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {colorPalette.map((color) => (
              <ColorSwatchCard key={color.name} {...color} />
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <SectionHeader
            title="TYPOGRAPHY"
            subtitle="Military-grade typefaces for tactical readability"
          />
          <div className="space-y-8">
            {/* Orbitron Display Font */}
            <div className="cyber-panel p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1">
                  --font-display
                </span>
                <span className="text-sm text-primary font-mono">Orbitron</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Used for headings, titles, and high-impact text. Geometric, futuristic, and authoritative.
              </p>
              <div className="space-y-4">
                <p className="font-display text-5xl text-foreground">SYSTEM ONLINE</p>
                <p className="font-display text-3xl text-foreground">MISSION CONTROL ACTIVE</p>
                <p className="font-display text-xl text-foreground">TACTICAL DISPLAY INITIALIZED</p>
                <p className="font-display text-base text-foreground">PRIMARY SYSTEMS NOMINAL</p>
              </div>
            </div>

            {/* Rajdhani Body Font */}
            <div className="cyber-panel p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1">
                  --font-body
                </span>
                <span className="text-sm text-primary font-mono">Rajdhani</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Primary body text font. Readable, technical feel with excellent legibility at all sizes.
              </p>
              <div className="space-y-4">
                <p className="font-body text-3xl text-foreground">
                  Self-Organizing Flight Intelligence Agent
                </p>
                <p className="font-body text-xl text-foreground">
                  Advanced neural network for autonomous flight control and decision-making systems.
                </p>
                <p className="font-body text-base text-foreground">
                  The system processes real-time telemetry data, environmental conditions, and mission
                  parameters to optimize flight performance and ensure mission success.
                </p>
              </div>
            </div>

            {/* JetBrains Mono */}
            <div className="cyber-panel p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1">
                  --font-mono
                </span>
                <span className="text-sm text-primary font-mono">JetBrains Mono</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Code, data values, and technical information. Crisp monospace with programming ligatures.
              </p>
              <div className="space-y-4 font-mono">
                <p className="text-xl text-foreground">const status = "OPERATIONAL";</p>
                <p className="text-base text-foreground">
                  altitude: 12,500ft | airspeed: 145kts | heading: 270deg
                </p>
                <p className="text-sm text-primary">
                  // System telemetry active - 20Hz data stream
                </p>
                <p className="text-xs text-muted-foreground">
                  0x7F4A2B9C | 192.168.1.1:8080 | UTC+0000
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Layout Section */}
        <section>
          <SectionHeader
            title="SPACING & LAYOUT"
            subtitle="Sharp edges, cyber panels, and grid patterns"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sharp Edges */}
            <div className="cyber-panel p-6">
              <h3 className="font-display text-xl text-primary mb-4">SHARP EDGES</h3>
              <p className="text-muted-foreground text-sm mb-6">
                All components use border-radius: 0 for a tactical, military aesthetic.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-primary/20 border border-primary flex items-center justify-center">
                  <span className="text-xs font-mono">0px</span>
                </div>
                <div className="h-16 bg-secondary/20 border border-secondary flex items-center justify-center">
                  <span className="text-xs font-mono">0px</span>
                </div>
                <div className="h-16 bg-accent/20 border border-accent flex items-center justify-center">
                  <span className="text-xs font-mono">0px</span>
                </div>
              </div>
            </div>

            {/* Grid Pattern */}
            <div className="cyber-panel p-6">
              <h3 className="font-display text-xl text-primary mb-4">GRID PATTERN</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Subtle 30px grid overlay provides tactical coordinate reference.
              </p>
              <div className="h-32 bg-grid-pattern border border-border relative">
                <div className="absolute top-2 left-2 text-xs font-mono text-primary/60">
                  --grid-size: 30px
                </div>
                <div className="absolute bottom-2 right-2 text-xs font-mono text-primary/60">
                  hsla(195, 100%, 50%, 0.05)
                </div>
              </div>
            </div>

            {/* Cyber Panel Examples */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-display text-xl text-foreground">CYBER PANEL VARIANTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="cyber-panel p-4">
                  <h4 className="font-display text-sm text-primary mb-2">DEFAULT PANEL</h4>
                  <p className="text-xs text-muted-foreground">
                    Cut-corner clip-path with gradient border and drop shadow.
                  </p>
                </div>
                <div className="cyber-panel cyber-panel-sm p-4">
                  <h4 className="font-display text-sm text-secondary mb-2">SMALL VARIANT</h4>
                  <p className="text-xs text-muted-foreground">
                    Reduced corner cut for compact components.
                  </p>
                </div>
                <div className="cyber-panel p-4 border-glow-cyan">
                  <h4 className="font-display text-sm text-primary mb-2">WITH GLOW</h4>
                  <p className="text-xs text-muted-foreground">
                    Enhanced visibility with border glow effect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Effects Section */}
        <section>
          <SectionHeader
            title="EFFECTS"
            subtitle="Neon glows, animations, and visual feedback"
          />

          {/* Text Glow Effects */}
          <div className="cyber-panel p-6 mb-8">
            <h3 className="font-display text-xl text-foreground mb-6">TEXT GLOW EFFECTS</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <GlowDemo
                label="CYAN"
                className="text-primary text-glow-cyan"
                cssClass=".text-glow-cyan"
              />
              <GlowDemo
                label="PURPLE"
                className="text-secondary text-glow-purple"
                cssClass=".text-glow-purple"
              />
              <GlowDemo
                label="YELLOW"
                className="text-accent text-glow-yellow"
                cssClass=".text-glow-yellow"
              />
              <GlowDemo
                label="GREEN"
                className="text-success text-glow-green"
                cssClass=".text-glow-green"
              />
              <GlowDemo
                label="RED"
                className="text-destructive text-glow-red"
                cssClass=".text-glow-red"
              />
            </div>
          </div>

          {/* Border Glow Effects */}
          <div className="cyber-panel p-6 mb-8">
            <h3 className="font-display text-xl text-foreground mb-6">BORDER GLOW EFFECTS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-primary border-glow-cyan bg-card">
                <span className="font-mono text-xs text-muted-foreground">.border-glow-cyan</span>
                <p className="font-display text-primary mt-2">ACTIVE ELEMENT</p>
              </div>
              <div className="p-4 border border-secondary border-glow-purple bg-card">
                <span className="font-mono text-xs text-muted-foreground">.border-glow-purple</span>
                <p className="font-display text-secondary mt-2">SELECTED STATE</p>
              </div>
              <div className="p-4 border border-primary border-glow bg-card text-primary">
                <span className="font-mono text-xs text-muted-foreground">.border-glow</span>
                <p className="font-display mt-2">DYNAMIC GLOW</p>
              </div>
            </div>
          </div>

          {/* Animations */}
          <div className="cyber-panel p-6">
            <h3 className="font-display text-xl text-foreground mb-6">ANIMATIONS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimationDemo
                label="PULSE GLOW"
                className="animate-pulse-glow text-success"
                cssClass=".animate-pulse-glow"
              />
              <AnimationDemo
                label="FLICKER"
                className="animate-flicker text-warning"
                cssClass=".animate-flicker"
              />
              <AnimationDemo
                label="SKELETON"
                className="animate-skeleton-breathe border border-primary p-2"
                cssClass=".animate-skeleton-breathe"
              />
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-2 border-primary border-t-transparent animate-radar" />
                  <div className="absolute inset-2 bg-primary/10" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">.animate-radar</span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Indicators */}
        <section>
          <SectionHeader
            title="STATUS INDICATORS"
            subtitle="Visual feedback for system states"
          />
          <div className="cyber-panel p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatusIndicator status="active" label="ONLINE" />
              <StatusIndicator status="warning" label="WARNING" />
              <StatusIndicator status="error" label="ERROR" />
              <StatusIndicator status="idle" label="OFFLINE" />
            </div>
          </div>
        </section>

        {/* Component Showcase */}
        <section>
          <SectionHeader
            title="COMPONENT SHOWCASE"
            subtitle="Quick preview of available components"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">PRIMARY</Button>
                  <Button variant="secondary" size="sm">SECONDARY</Button>
                  <Button variant="outline" size="sm">OUTLINE</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="destructive" size="sm">ALERT</Button>
                  <Button variant="ghost" size="sm">GHOST</Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  &rarr; Components/Button
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">ACTIVE</Badge>
                  <Badge variant="secondary">STANDBY</Badge>
                  <Badge variant="outline">OFFLINE</Badge>
                  <Badge variant="destructive">CRITICAL</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  &rarr; Components/Badge
                </p>
              </CardContent>
            </Card>

            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter coordinates..." />
                <Input placeholder="Disabled" disabled />
                <p className="text-xs text-muted-foreground font-mono">
                  &rarr; Components/Input
                </p>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border p-3 bg-muted/30">
                  <p className="text-xs font-mono text-primary">NESTED CARD</p>
                  <p className="text-xs text-muted-foreground">Container component</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  &rarr; Components/Card
                </p>
              </CardContent>
            </Card>

            {/* Data Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Display</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="data-label">ALTITUDE</span>
                    <span className="data-value text-xl text-primary block">12,500 ft</span>
                  </div>
                  <div>
                    <span className="data-label">AIRSPEED</span>
                    <span className="data-value text-xl text-success block">145 kts</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-4">
                  .data-label + .data-value
                </p>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="data-label">MISSION PROGRESS</span>
                  <div className="progress-cyber mt-2">
                    <div className="progress-cyber-fill" style={{ width: "67%" }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  &rarr; Components/Progress
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Reference */}
        <section>
          <SectionHeader
            title="QUICK REFERENCE"
            subtitle="Essential CSS classes and variables"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-panel p-6">
              <h3 className="font-display text-lg text-primary mb-4">CSS VARIABLES</h3>
              <div className="space-y-2 font-mono text-sm">
                <p><span className="text-muted-foreground">--font-display:</span> <span className="text-foreground">'Orbitron'</span></p>
                <p><span className="text-muted-foreground">--font-body:</span> <span className="text-foreground">'Rajdhani'</span></p>
                <p><span className="text-muted-foreground">--font-mono:</span> <span className="text-foreground">'JetBrains Mono'</span></p>
                <p><span className="text-muted-foreground">--radius:</span> <span className="text-foreground">0px</span></p>
                <p><span className="text-muted-foreground">--grid-size:</span> <span className="text-foreground">30px</span></p>
              </div>
            </div>
            <div className="cyber-panel p-6">
              <h3 className="font-display text-lg text-primary mb-4">UTILITY CLASSES</h3>
              <div className="space-y-2 font-mono text-sm">
                <p><span className="text-muted-foreground">.cyber-panel</span> <span className="text-foreground">// Cut-corner container</span></p>
                <p><span className="text-muted-foreground">.text-glow-*</span> <span className="text-foreground">// Neon text effects</span></p>
                <p><span className="text-muted-foreground">.border-glow-*</span> <span className="text-foreground">// Glowing borders</span></p>
                <p><span className="text-muted-foreground">.bg-grid-pattern</span> <span className="text-foreground">// Grid background</span></p>
                <p><span className="text-muted-foreground">.status-*</span> <span className="text-foreground">// State indicators</span></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center">
        <p className="font-display text-xl text-primary text-glow-cyan mb-2">
          SKYNET DESIGN SYSTEM
        </p>
        <p className="font-mono text-sm text-muted-foreground mb-4">
          @kingly/ui // v1.0.0
        </p>
        <p className="font-body text-muted-foreground max-w-2xl mx-auto">
          Powering Sofia Dashboard and Kingly Applications with military-grade aesthetics
          and high-performance UI components.
        </p>
      </footer>
    </div>
  );
};

// Helper Components

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mb-8 border-l-2 border-primary pl-4">
    <h2 className="font-display text-2xl text-foreground tracking-wide">{title}</h2>
    <p className="text-muted-foreground text-sm">{subtitle}</p>
  </div>
);

const ColorSwatchCard = ({
  name,
  cssVar,
  hsl,
  hex,
  tailwind,
  description,
}: {
  name: string;
  cssVar: string;
  hsl: string;
  hex: string;
  tailwind: string;
  description: string;
}) => (
  <div className="border border-border bg-card overflow-hidden">
    <div className={`${tailwind} h-20`} />
    <div className="p-3 space-y-2">
      <p className="font-display text-sm text-foreground">{name}</p>
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">{cssVar}</p>
        <p className="font-mono text-xs text-primary">{hex}</p>
        <p className="font-mono text-xs text-muted-foreground truncate" title={hsl}>
          {hsl}
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

const GlowDemo = ({
  label,
  className,
  cssClass,
}: {
  label: string;
  className: string;
  cssClass: string;
}) => (
  <div className="text-center">
    <p className={`font-display text-2xl mb-2 ${className}`}>{label}</p>
    <span className="font-mono text-xs text-muted-foreground">{cssClass}</span>
  </div>
);

const AnimationDemo = ({
  label,
  className,
  cssClass,
}: {
  label: string;
  className: string;
  cssClass: string;
}) => (
  <div className="text-center">
    <div className={`w-8 h-8 mx-auto mb-4 ${className}`} />
    <p className="font-display text-sm text-foreground mb-1">{label}</p>
    <span className="font-mono text-xs text-muted-foreground">{cssClass}</span>
  </div>
);

const StatusIndicator = ({
  status,
  label,
}: {
  status: "active" | "warning" | "error" | "idle";
  label: string;
}) => {
  const statusClasses = {
    active: "bg-success status-active",
    warning: "bg-warning status-warning",
    error: "bg-destructive status-error",
    idle: "bg-muted-foreground status-idle",
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 ${statusClasses[status]}`} />
      <div>
        <span className="font-mono text-sm text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground font-mono">.status-{status}</span>
      </div>
    </div>
  );
};

const meta = {
  title: "SKYNET/Welcome",
  component: WelcomeComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Comprehensive design system documentation for the SKYNET cyberpunk/military tactical aesthetic used in Sofia Dashboard and Kingly applications.",
      },
    },
  },
} satisfies Meta<typeof WelcomeComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
