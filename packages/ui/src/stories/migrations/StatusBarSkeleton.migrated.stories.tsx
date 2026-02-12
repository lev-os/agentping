import type { Meta, StoryObj } from "@storybook/react";
import { StatusBarSkeleton } from "../../components/migrations/status-bar-skeleton";

const meta: Meta<typeof StatusBarSkeleton> = {
  title: "Migrations/WebUI/Skeletons/StatusBarSkeleton",
  component: StatusBarSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatusBarSkeleton>;

export const Default: Story = {
  args: {},
};
