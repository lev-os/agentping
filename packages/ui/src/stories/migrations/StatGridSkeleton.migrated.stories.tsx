import type { Meta, StoryObj } from "@storybook/react";
import { StatGridSkeleton } from "../../components/migrations/stat-grid-skeleton";

const meta: Meta<typeof StatGridSkeleton> = {
  title: "Migrations/WebUI/Skeletons/StatGridSkeleton",
  component: StatGridSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatGridSkeleton>;

export const Default: Story = {
  args: {},
};
