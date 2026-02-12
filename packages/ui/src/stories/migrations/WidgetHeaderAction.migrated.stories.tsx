import type { Meta, StoryObj } from "@storybook/react";
import { WidgetHeaderAction } from "../../components/migrations/widget-header-action";

const meta: Meta<typeof WidgetHeaderAction> = {
  title: "Migrations/WebUI/Dashboard/WidgetHeaderAction",
  component: WidgetHeaderAction,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetHeaderAction>;

export const Default: Story = {
  args: {},
};
