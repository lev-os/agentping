import type { Meta, StoryObj } from "@storybook/react";
import { MetricChart } from "../../components/migrations/metric-chart";

const meta: Meta<typeof MetricChart> = {
  title: "Migrations/WebUI/MetricChart",
  component: MetricChart,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MetricChart>;

export const Default: Story = {
  args: {
    title: "Requests/sec",
    data: [
      { time: "09:00", value: 42 },
      { time: "09:05", value: 58 },
      { time: "09:10", value: 35 },
      { time: "09:15", value: 72 },
      { time: "09:20", value: 65 },
      { time: "09:25", value: 90 },
    ],
  },
};
