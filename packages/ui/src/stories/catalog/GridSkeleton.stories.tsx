import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridSkeleton } from "../../components/catalog/grid-skeleton";

const meta: Meta<typeof GridSkeleton> = {
  title: "Catalog/WebUI/Skeletons/GridSkeleton",
  component: GridSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GridSkeleton>;

export const Default: Story = {
  args: {},
};
