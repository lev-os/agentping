import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "../components/ui/progress";
import { useEffect, useState } from "react";

/**
 * Progress component with SKYNET styling.
 * Features glowing gradient indicator and sharp edges for tactical displays.
 */
const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A progress bar component with SKYNET cyberpunk styling. Features a glowing cyan-to-primary gradient with shadow effects.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
      description: "The progress value (0-100)",
    },
    indicatorClassName: {
      control: "text",
      description: "Additional classes for the progress indicator",
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    className: "w-[300px]",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: "w-[300px]",
  },
};

export const Quarter: Story = {
  args: {
    value: 25,
    className: "w-[300px]",
  },
};

export const Half: Story = {
  args: {
    value: 50,
    className: "w-[300px]",
  },
};

export const ThreeQuarters: Story = {
  args: {
    value: 75,
    className: "w-[300px]",
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    className: "w-[300px]",
  },
};

export const CustomIndicator: Story = {
  args: {
    value: 60,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]",
  },
};

export const WarningIndicator: Story = {
  args: {
    value: 85,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_10px_#eab308]",
  },
};

export const CriticalIndicator: Story = {
  args: {
    value: 95,
    className: "w-[300px]",
    indicatorClassName: "bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_10px_#ef4444]",
  },
};

const AnimatedProgressDemo = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[300px] space-y-2">
      <Progress value={progress} />
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>LOADING...</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export const Animated: Story = {
  render: () => <AnimatedProgressDemo />,
};

export const TrainingProgress: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <h3 className="font-display text-lg text-foreground">TRAINING METRICS</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">EPISODE PROGRESS</span>
            <span className="font-mono text-primary">73/100</span>
          </div>
          <Progress value={73} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">LEVEL COMPLETION</span>
            <span className="font-mono text-primary">5/35</span>
          </div>
          <Progress value={14} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SUCCESS RATE</span>
            <span className="font-mono text-primary">89%</span>
          </div>
          <Progress
            value={89}
            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_#22c55e]"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const SystemHealth: Story = {
  render: () => (
    <div className="w-[350px] space-y-4 p-4 border border-border bg-card/50">
      <h3 className="font-display text-sm text-primary">SYSTEM RESOURCES</h3>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">CPU</span>
            <span className="text-foreground">45%</span>
          </div>
          <Progress value={45} className="h-1" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">MEMORY</span>
            <span className="text-foreground">72%</span>
          </div>
          <Progress
            value={72}
            className="h-1"
            indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_6px_#eab308]"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">GPU</span>
            <span className="text-foreground">91%</span>
          </div>
          <Progress
            value={91}
            className="h-1"
            indicatorClassName="bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_6px_#ef4444]"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">DISK</span>
            <span className="text-foreground">23%</span>
          </div>
          <Progress
            value={23}
            className="h-1"
            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_6px_#22c55e]"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllValues: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <h3 className="font-display text-lg text-foreground">PROGRESS VALUES</h3>
      <div className="space-y-3">
        {[0, 25, 50, 75, 100].map((value) => (
          <div key={value} className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>{value}%</span>
            </div>
            <Progress value={value} />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
