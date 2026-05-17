import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatGridSkeleton } from "../../components/catalog/stat-grid-skeleton";

const meta: Meta<typeof StatGridSkeleton> = {
  title: "Catalog/WebUI/Skeletons/StatGridSkeleton",
  component: StatGridSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatGridSkeleton>;

export const Default: Story = {
  args: {},
};
