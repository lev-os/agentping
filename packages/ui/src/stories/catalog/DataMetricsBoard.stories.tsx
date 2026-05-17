import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataMetricsBoard } from "../../components/catalog/data-metrics-board";

const meta = {
  title: "Catalog/WebUI/Data/DataMetricsBoard",
  component: DataMetricsBoard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DataMetricsBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "System Metrics",
    metrics: [
      { id: "cpu", label: "CPU Usage", value: "72%", change: 5.2 },
      { id: "mem", label: "Memory", value: "8.2", unit: "GB", change: -1.4 },
      { id: "disk", label: "Disk I/O", value: "340", unit: "MB/s", change: 12.0 },
      { id: "net", label: "Network", value: "1.2", unit: "Gbps", change: 0.3 },
      { id: "req", label: "Requests", value: "14.2k", change: 8.7 },
      { id: "err", label: "Error Rate", value: "0.03%", change: -2.1 },
    ],
  },
};
