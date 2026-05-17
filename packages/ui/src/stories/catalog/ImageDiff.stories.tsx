import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageDiff } from "../../components/catalog/image-diff";

const meta: Meta<typeof ImageDiff> = {
  title: "Catalog/WebUI/ImageDiff",
  component: ImageDiff,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ImageDiff>;

export const Default: Story = {
  args: {},
};
