import type { Meta, StoryObj } from "@storybook/react";
import { StatusPieChart } from "../../components/migrations/status-pie-chart";

const meta = {
  title: "Migrations/Studio/StatusPieChart",
  component: StatusPieChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusPieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { name: "Running", value: 4, color: "hsl(150 100% 45%)" },
      { name: "Stopped", value: 1, color: "hsl(220 10% 55%)" },
      { name: "Failed", value: 1, color: "hsl(0 85% 55%)" },
    ],
  },
};

export const AllRunning: Story = {
  args: {
    data: [{ name: "Running", value: 6, color: "hsl(150 100% 45%)" }],
  },
};

export const Empty: Story = { args: { data: [] } };
