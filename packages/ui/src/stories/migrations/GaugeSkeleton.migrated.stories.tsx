import type { Meta, StoryObj } from "@storybook/react";
import { GaugeSkeleton } from "../../components/migrations/gauge-skeleton";

const meta: Meta<typeof GaugeSkeleton> = {
  title: "Migrations/WebUI/Skeletons/GaugeSkeleton",
  component: GaugeSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GaugeSkeleton>;

export const Default: Story = {
  args: {},
};
