import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCompare } from "../../components/catalog/image-compare";

const meta: Meta<typeof ImageCompare> = {
  title: "Catalog/WebUI/ImageCompare",
  component: ImageCompare,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ImageCompare>;

export const Default: Story = {
  args: {},
};
