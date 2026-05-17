import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmUptimeChart } from "../../components/catalog/dm-uptime-chart";

const meta = {
  title: "Catalog/DashboardManager/UptimeChart",
  component: DmUptimeChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmUptimeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortUptime: Story = { args: { uptimeMs: 1000 * 60 * 30 } };
export const LongUptime: Story = { args: { uptimeMs: 1000 * 60 * 60 * 18 } };
export const MultiDay: Story = { args: { uptimeMs: 1000 * 60 * 60 * 72 } };

export const Default = ShortUptime;
