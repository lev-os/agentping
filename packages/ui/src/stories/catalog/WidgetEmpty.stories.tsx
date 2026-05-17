import type { Meta, StoryObj } from "@storybook/react-vite";
import { WidgetEmpty } from "../../components/catalog/widget-empty";

const meta: Meta<typeof WidgetEmpty> = {
  title: "Catalog/WebUI/Dashboard/WidgetEmpty",
  component: WidgetEmpty,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetEmpty>;

export const Default: Story = {
  args: {},
};
