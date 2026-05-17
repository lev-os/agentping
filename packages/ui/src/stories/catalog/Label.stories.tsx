// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../../components/catalog/label";

const meta: Meta<typeof Label> = {
  title: "Catalog/WebUI/Sofia/Label",
  component: Label,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Agent Name",
  },
};
