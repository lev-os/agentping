import type { Meta, StoryObj } from "@storybook/react-vite";
import { WidgetHeaderAction } from "../../components/catalog/widget-header-action";

const meta: Meta<typeof WidgetHeaderAction> = {
  title: "Catalog/WebUI/Dashboard/WidgetHeaderAction",
  component: WidgetHeaderAction,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetHeaderAction>;

export const Default: Story = {
  args: {},
};
