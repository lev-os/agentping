import type { Meta, StoryObj } from "@storybook/react";
import { Zap, Terminal, Bot, RefreshCw } from "lucide-react";
import { Dashboard } from "../../components/migrations/dashboard";

const meta = {
  title: "Migrations/Studio/Dashboard",
  component: Dashboard,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 600 }}><Story /></div>],
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    telemetry: { cpuUsage: 45, memoryUsage: 72, activeAgents: 3, totalTasks: 18, completedTasks: 12, uptime: "4h 23m" },
    quickOps: [
      { id: "1", label: "New Agent", icon: <Bot size={16} /> },
      { id: "2", label: "Run Tests", icon: <Terminal size={16} /> },
      { id: "3", label: "Deploy", icon: <Zap size={16} /> },
      { id: "4", label: "Restart All", icon: <RefreshCw size={16} /> },
    ],
    recentActivity: [
      { id: "1", title: "Agent completed refactor task", time: "2m ago" },
      { id: "2", title: "Build passed on main", time: "5m ago" },
      { id: "3", title: "New PR opened #142", time: "12m ago" },
    ],
  },
};

export const Loading: Story = { args: { loading: true } };
