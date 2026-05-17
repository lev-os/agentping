import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartSkeleton } from "../../components/catalog/chart-skeleton";

const meta: Meta<typeof ChartSkeleton> = {
  title: "Catalog/WebUI/Skeletons/ChartSkeleton",
  component: ChartSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChartSkeleton>;

export const Default: Story = {
  args: {},
  render: () => <ChartSkeleton height="12rem" />,
};

export const Static: Story = {
  render: () => <ChartSkeleton height="8rem" animated={false} />,
};
