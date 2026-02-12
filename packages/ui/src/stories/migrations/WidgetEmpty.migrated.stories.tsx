import type { Meta, StoryObj } from "@storybook/react";
import { WidgetEmpty } from "../../components/migrations/widget-empty";

const meta: Meta<typeof WidgetEmpty> = {
  title: "Migrations/WebUI/Dashboard/WidgetEmpty",
  component: WidgetEmpty,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetEmpty>;

export const Default: Story = {
  args: {},
};
