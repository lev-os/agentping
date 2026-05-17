import type { Meta, StoryObj } from "@storybook/react-vite";
import { WidgetCrashFallback } from "../../components/catalog/widget-crash-fallback";

const meta: Meta<typeof WidgetCrashFallback> = {
  title: "Catalog/WebUI/Dashboard/WidgetCrashFallback",
  component: WidgetCrashFallback,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetCrashFallback>;

export const Default: Story = {
  render: () => (
    <WidgetCrashFallback
      widgetId="widget-1"
      error={new Error("Cannot read property 'map' of undefined")}
      resetError={() => {}}
    />
  ),
};

export const WithoutReset: Story = {
  render: () => (
    <WidgetCrashFallback
      widgetId="widget-2"
      error={new Error("Network timeout")}
    />
  ),
};
