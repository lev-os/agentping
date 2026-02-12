import type { Meta, StoryObj } from "@storybook/react";
import { DashboardWidget } from "../../components/migrations/dashboard-widget";

const meta: Meta<typeof DashboardWidget> = {
  title: "Migrations/WebUI/Dashboard/DashboardWidget",
  component: DashboardWidget,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DashboardWidget>;

export const Default: Story = {
  args: {},
};
