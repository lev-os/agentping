import type { Meta, StoryObj } from "@storybook/react-vite";
import { GaugeSkeleton } from "../../components/catalog/gauge-skeleton";

const meta: Meta<typeof GaugeSkeleton> = {
  title: "Catalog/WebUI/Skeletons/GaugeSkeleton",
  component: GaugeSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GaugeSkeleton>;

export const Default: Story = {
  args: {},
};
