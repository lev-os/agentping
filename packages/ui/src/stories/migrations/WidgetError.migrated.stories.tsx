import type { Meta, StoryObj } from "@storybook/react-vite";
import { WidgetError } from "../../components/migrations/widget-error";

const meta: Meta<typeof WidgetError> = {
  title: "Migrations/WebUI/Dashboard/WidgetError",
  component: WidgetError,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetError>;

export const Default: Story = {
  args: {
    error: { message: "Failed to load data", name: "FetchError" },
    widgetId: "widget-001",
  },
};
