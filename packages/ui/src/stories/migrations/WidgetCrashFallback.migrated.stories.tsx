import type { Meta, StoryObj } from "@storybook/react";
import { WidgetCrashFallback } from "../../components/migrations/widget-crash-fallback";

const meta: Meta<typeof WidgetCrashFallback> = {
  title: "Migrations/WebUI/Dashboard/WidgetCrashFallback",
  component: WidgetCrashFallback,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetCrashFallback>;

export const Default: Story = {
  args: {
    widgetId: "widget-1",
    error: new Error("Cannot read property 'map' of undefined"),
    resetError: () => {},
  },
};

export const WithoutReset: Story = {
  args: {
    widgetId: "widget-2",
    error: new Error("Network timeout"),
  },
};
