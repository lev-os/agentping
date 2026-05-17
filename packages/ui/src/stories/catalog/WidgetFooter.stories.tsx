import type { Meta, StoryObj } from "@storybook/react-vite";
import { WidgetFooter } from "../../components/catalog/widget-footer";

const meta: Meta<typeof WidgetFooter> = {
  title: "Catalog/WebUI/Dashboard/WidgetFooter",
  component: WidgetFooter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetFooter>;

export const Default: Story = {
  args: {},
};
