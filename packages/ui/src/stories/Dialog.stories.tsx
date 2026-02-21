// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

/**
 * Dialog component with SKYNET cyber-panel styling.
 * Modal overlay with sharp edges and tactical aesthetics.
 */
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dialog/modal component with SKYNET cyberpunk styling. Features cyber-panel aesthetic with dark overlay, sharp edges, and glowing borders.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>OPEN DIALOG</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SYSTEM NOTIFICATION</DialogTitle>
          <DialogDescription>
            A standard dialog with header, content, and footer sections.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This is the main content area of the dialog. You can place any content here including
            forms, data displays, or informational text.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">CANCEL</Button>
          </DialogClose>
          <Button>CONFIRM</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmAction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">ABORT MISSION</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CONFIRM ABORT</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The current training session will be terminated.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 border border-destructive/50 bg-destructive/10">
            <Badge variant="destructive">WARNING</Badge>
            <span className="text-sm text-destructive">All unsaved progress will be lost</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">CANCEL</Button>
          </DialogClose>
          <Button variant="destructive">CONFIRM ABORT</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const TrainingConfig: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>CONFIGURE TRAINING</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>TRAINING PARAMETERS</DialogTitle>
          <DialogDescription>
            Configure neural network training settings
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">LEARNING RATE</label>
              <div className="p-2 border border-border bg-muted/50 font-mono text-sm">3e-4</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">BATCH SIZE</label>
              <div className="p-2 border border-border bg-muted/50 font-mono text-sm">64</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">N ENVS</label>
              <div className="p-2 border border-border bg-muted/50 font-mono text-sm">8</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground">EPOCHS</label>
              <div className="p-2 border border-border bg-muted/50 font-mono text-sm">10</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">FEATURES</label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">BC</Badge>
              <Badge variant="success">HER</Badge>
              <Badge variant="default">CURIOSITY</Badge>
              <Badge variant="outline">WORLD MODEL</Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">CANCEL</Button>
          </DialogClose>
          <Button>APPLY CONFIG</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const StatusDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">VIEW STATUS</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>SYSTEM STATUS</DialogTitle>
            <Badge variant="success">ONLINE</Badge>
          </div>
          <DialogDescription>
            Current operational status of all subsystems
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Neural Network</span>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Training Pipeline</span>
              <Badge variant="warning">STANDBY</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">X-Plane Connection</span>
              <Badge variant="destructive">OFFLINE</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">MEMORY USAGE</span>
              <span>4.2 GB / 8 GB</span>
            </div>
            <Progress value={52} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>CLOSE</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">TRIGGER ALERT</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <DialogTitle className="text-destructive">CRITICAL ALERT</DialogTitle>
          </div>
          <DialogDescription>
            Immediate attention required
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 border border-destructive/50 bg-destructive/10 space-y-2">
            <p className="text-sm font-mono text-destructive">
              ERROR: Training divergence detected
            </p>
            <p className="text-xs text-muted-foreground">
              Policy loss exceeded threshold (0.5 &gt; 0.1). Automatic checkpoint saved.
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Timestamp: 2024-01-15T14:23:45.123Z
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">DISMISS</Button>
          </DialogClose>
          <Button variant="destructive">RESET TRAINING</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LoadingDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>INITIALIZE</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>INITIALIZING SYSTEM</DialogTitle>
          <DialogDescription>
            Please wait while components load
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Loading neural network...</span>
              <span className="text-primary">67%</span>
            </div>
            <Progress value={67} />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Processing checkpoint data
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const WideDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>VIEW TELEMETRY</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>FLIGHT TELEMETRY</DialogTitle>
          <DialogDescription>
            Real-time flight data from X-Plane connection
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-4 gap-4 font-mono text-sm">
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">ALTITUDE</span>
              <span className="text-lg text-primary">3,500 FT</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">AIRSPEED</span>
              <span className="text-lg text-primary">125 KTS</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">HEADING</span>
              <span className="text-lg text-primary">275°</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">V/S</span>
              <span className="text-lg text-primary">+500 FPM</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">PITCH</span>
              <span className="text-lg text-primary">5.2°</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">BANK</span>
              <span className="text-lg text-primary">-2.1°</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">THROTTLE</span>
              <span className="text-lg text-primary">65%</span>
            </div>
            <div className="p-3 border border-border bg-muted/50">
              <span className="text-xs text-muted-foreground block">FLAPS</span>
              <span className="text-lg text-primary">10°</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">CLOSE</Button>
          </DialogClose>
          <Button>REFRESH DATA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
