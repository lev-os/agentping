import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmAnalyticsPanel } from "../../components/migrations/dm-analytics-panel";

const meta = {
  title: "Migrations/DashboardManager/AnalyticsPanel",
  component: DmAnalyticsPanel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmAnalyticsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dashboards: [
      { status: { status: "online", restartAttempts: 0 } },
      { status: { status: "online", restartAttempts: 2 } },
      { status: { status: "failed", restartAttempts: 5 } },
      { status: { status: "stopped", restartAttempts: 0 } },
    ],
  },
};
