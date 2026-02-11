import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

/**
 * Card component with SKYNET cyber-panel styling.
 * Provides a container with sharp edges and tactical aesthetics.
 */
const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A card component with SKYNET cyberpunk styling. Features cyber-panel aesthetic with sharp edges and glowing borders.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SYSTEM STATUS</CardTitle>
        <CardDescription>Current operational parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          All systems nominal. Neural network initialized and ready for deployment.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">ENGAGE</Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>MISSION BRIEFING</CardTitle>
        <CardDescription>Priority Alpha clearance required</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>TRAINING MODULE</CardTitle>
          <Badge variant="success">ACTIVE</Badge>
        </div>
        <CardDescription>Level 7 certification in progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-mono">73%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time Elapsed</span>
            <span className="text-primary font-mono">02:34:17</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const FlightStatus: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>FLIGHT TELEMETRY</CardTitle>
          <Badge variant="warning">STANDBY</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <span className="text-muted-foreground block">ALTITUDE</span>
            <span className="text-lg text-primary">3,500 FT</span>
          </div>
          <div>
            <span className="text-muted-foreground block">AIRSPEED</span>
            <span className="text-lg text-primary">125 KTS</span>
          </div>
          <div>
            <span className="text-muted-foreground block">HEADING</span>
            <span className="text-lg text-primary">275°</span>
          </div>
          <div>
            <span className="text-muted-foreground block">V/S</span>
            <span className="text-lg text-primary">+500 FPM</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm">DISENGAGE</Button>
        <Button size="sm">ARM AUTOPILOT</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">
          Minimal card with content only. Use for simple data displays without header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle>NEURAL NETWORK</CardTitle>
        <CardDescription>Click to configure training parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">Online - 350K parameters</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">BASIC CARD</h3>
        <Card>
          <CardHeader>
            <CardTitle>COMPONENT TITLE</CardTitle>
            <CardDescription>Supporting description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Main content area</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">ACTION</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATUS CARDS</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SYSTEM A</CardTitle>
                <Badge variant="success">OK</Badge>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SYSTEM B</CardTitle>
                <Badge variant="destructive">FAIL</Badge>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
