import type { Meta, StoryObj } from "@storybook/react";
import { ResponsiveDashboard } from "../../components/migrations/responsive-dashboard";

const meta: Meta<typeof ResponsiveDashboard> = {
  title: "Migrations/WebUI/Dashboard/ResponsiveDashboard",
  component: ResponsiveDashboard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ResponsiveDashboard>;

export const Default: Story = {
  args: {
    widgets: [],
    layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
    onLayoutChange: () => {},
  },
};
