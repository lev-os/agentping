import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, Cpu, Database, Globe, HardDrive, Zap } from "lucide-react";
import { StatusGrid, type StatusCard } from "../../components/catalog/status-grid";

const demoCards: StatusCard[] = [
  {
    id: "1",
    title: "CPU Usage",
    status: "success",
    value: "45%",
    description: "System CPU utilization is healthy",
    icon: <Cpu size={24} />,
    metadata: { cores: 8, threads: 16 },
  },
  {
    id: "2",
    title: "Memory",
    status: "warning",
    value: "78%",
    description: "Memory usage approaching threshold",
    icon: <HardDrive size={24} />,
    metadata: { used: "6.2 GB", total: "8 GB" },
  },
  {
    id: "3",
    title: "API Health",
    status: "error",
    value: "503",
    description: "Service unavailable - connection timeout",
    icon: <Globe size={24} />,
    metadata: { endpoint: "/api/v1", uptime: "87.3%" },
  },
  {
    id: "4",
    title: "Database",
    status: "success",
    value: "12ms",
    description: "Query response time is optimal",
    icon: <Database size={24} />,
    metadata: { connections: 45, pool: 100 },
  },
  {
    id: "5",
    title: "Task Queue",
    status: "pending",
    value: "23",
    description: "Tasks waiting in queue",
    icon: <Activity size={24} />,
  },
  {
    id: "6",
    title: "Power",
    status: "active",
    value: "250W",
    description: "Current power consumption",
    icon: <Zap size={24} />,
    metadata: { voltage: "120V", frequency: "60Hz" },
  },
];

const meta = {
  title: "Catalog/Studio/StatusGrid",
  component: StatusGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Raw catalog component from Studio Storybook. Brought into @kingly/ui unchanged for side-by-side consolidation analysis.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    columns: { control: "select", options: [2, 3, 4] },
  },
} satisfies Meta<typeof StatusGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cards: demoCards,
    columns: 3,
  },
};

export const Loading: Story = {
  args: {
    cards: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    cards: [],
    emptyMessage: "No status cards available",
  },
};
