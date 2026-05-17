import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryUsageChart } from "../../components/catalog/memory-usage-chart";

const meta: Meta<typeof MemoryUsageChart> = {
  title: "Catalog/WebUI/MemoryUsageChart",
  component: MemoryUsageChart,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MemoryUsageChart>;

export const Default: Story = {
  args: {
    data: [
      { time: "09:00", used: 512, total: 1024 },
      { time: "09:05", used: 580, total: 1024 },
      { time: "09:10", used: 640, total: 1024 },
      { time: "09:15", used: 720, total: 1024 },
      { time: "09:20", used: 690, total: 1024 },
      { time: "09:25", used: 810, total: 1024 },
    ],
  },
};
