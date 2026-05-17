// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShimmerText } from "../../components/catalog/shimmer-text";

const meta: Meta<typeof ShimmerText> = {
  title: "Catalog/WebUI/Sofia/ShimmerText",
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
