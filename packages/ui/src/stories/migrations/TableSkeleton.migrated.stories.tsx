import type { Meta, StoryObj } from "@storybook/react";
import { TableSkeleton } from "../../components/migrations/table-skeleton";

const meta: Meta<typeof TableSkeleton> = {
  title: "Migrations/WebUI/Skeletons/TableSkeleton",
  component: TableSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {
  args: {},
};
