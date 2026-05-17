import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponsiveDashboard } from "../../components/catalog/responsive-dashboard";

const meta: Meta<typeof ResponsiveDashboard> = {
  title: "Catalog/WebUI/Dashboard/ResponsiveDashboard",
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
