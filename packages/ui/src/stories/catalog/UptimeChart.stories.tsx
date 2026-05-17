import type { Meta, StoryObj } from "@storybook/react-vite";
import { UptimeChart } from "../../components/catalog/uptime-chart";

const meta = {
  title: "Catalog/Studio/UptimeChart",
  component: UptimeChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof UptimeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { timestamp: "08:00", uptimeHours: 2.0 },
      { timestamp: "10:00", uptimeHours: 4.5 },
      { timestamp: "12:00", uptimeHours: 6.2 },
      { timestamp: "14:00", uptimeHours: 8.1 },
      { timestamp: "16:00", uptimeHours: 10.0 },
      { timestamp: "18:00", uptimeHours: 12.3 },
    ],
  },
};

export const Empty: Story = { args: { data: [] } };
