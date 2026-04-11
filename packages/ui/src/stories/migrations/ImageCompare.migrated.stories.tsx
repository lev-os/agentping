import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCompare } from "../../components/migrations/image-compare";

const meta: Meta<typeof ImageCompare> = {
  title: "Migrations/WebUI/ImageCompare",
  component: ImageCompare,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ImageCompare>;

export const Default: Story = {
  args: {},
};
