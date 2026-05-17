import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBarSkeleton } from "../../components/catalog/status-bar-skeleton";

const meta: Meta<typeof StatusBarSkeleton> = {
  title: "Catalog/WebUI/Skeletons/StatusBarSkeleton",
  component: StatusBarSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatusBarSkeleton>;

export const Default: Story = {
  args: {},
};
