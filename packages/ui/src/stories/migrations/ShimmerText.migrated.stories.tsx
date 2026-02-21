// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { ShimmerText } from "../../components/migrations/shimmer-text";

const meta: Meta<typeof ShimmerText> = {
  title: "Migrations/WebUI/Sofia/ShimmerText",
  component: ShimmerText,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ShimmerText>;

export const Default: Story = {
  args: {
    children: "Shimmer text effect demo",
    glow: true,
  },
};
