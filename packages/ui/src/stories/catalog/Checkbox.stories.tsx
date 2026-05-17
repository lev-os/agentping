// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../components/catalog/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Catalog/WebUI/Sofia/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};
