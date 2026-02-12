import type { Meta, StoryObj } from "@storybook/react";
import { RadarChart } from "../../components/migrations/radar-chart";

const meta = {
  title: "Migrations/WebUI/Root/RadarChart",
  component: RadarChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    axes: [
      { label: "CPU", value: 78 },
      { label: "Memory", value: 65 },
      { label: "Disk", value: 42 },
      { label: "Network", value: 88 },
      { label: "GPU", value: 55 },
    ],
    size: 240,
  },
};
