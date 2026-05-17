import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableSkeleton } from "../../components/catalog/table-skeleton";

const meta: Meta<typeof TableSkeleton> = {
  title: "Catalog/WebUI/Skeletons/TableSkeleton",
  component: TableSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {
  args: {},
};
