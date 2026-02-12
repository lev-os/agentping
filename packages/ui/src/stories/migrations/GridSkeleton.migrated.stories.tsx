import type { Meta, StoryObj } from "@storybook/react";
import { GridSkeleton } from "../../components/migrations/grid-skeleton";

const meta: Meta<typeof GridSkeleton> = {
  title: "Migrations/WebUI/Skeletons/GridSkeleton",
  component: GridSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GridSkeleton>;

export const Default: Story = {
  args: {},
};
