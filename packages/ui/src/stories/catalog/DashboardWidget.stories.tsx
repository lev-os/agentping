import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashboardWidget } from "../../components/catalog/dashboard-widget";

const meta: Meta<typeof DashboardWidget> = {
  title: "Catalog/WebUI/Dashboard/DashboardWidget",
  component: DashboardWidget,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DashboardWidget>;

export const Default: Story = {
  args: {},
};
