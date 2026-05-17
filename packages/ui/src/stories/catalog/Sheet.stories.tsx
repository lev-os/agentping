// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sheet } from "../../components/catalog/sheet";

const meta: Meta<typeof Sheet> = {
  title: "Catalog/WebUI/Sofia/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  args: {},
};
