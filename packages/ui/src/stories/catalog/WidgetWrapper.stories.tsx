import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  WidgetWrapper,
  type WidgetWrapperProps,
} from "../../components/catalog/widget-wrapper";

const meta: Meta<typeof WidgetWrapper> = {
  title: "Catalog/WebUI/Dashboard/WidgetWrapper",
  component: WidgetWrapper,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WidgetWrapper>;

export const Default: Story = {
  args: {
    widgetId: "demo-widget",
    children: ({
      variant,
      containerWidth,
    }: Parameters<WidgetWrapperProps["children"]>[0]) => (
      <div className="p-4 border border-border rounded">
        <p className="text-sm font-mono">Variant: {variant}</p>
        <p className="text-xs text-muted-foreground">Width: {containerWidth}px</p>
      </div>
    ),
  },
};
