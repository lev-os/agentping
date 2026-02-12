import type { Meta, StoryObj } from "@storybook/react";
import { WidgetFooter } from "../../components/migrations/widget-footer";

const meta: Meta<typeof WidgetFooter> = {
  title: "Migrations/WebUI/Dashboard/WidgetFooter",
  component: WidgetFooter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetFooter>;

export const Default: Story = {
  args: {},
};
