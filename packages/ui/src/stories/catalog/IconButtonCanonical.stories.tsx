// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../../components/ui/icon-button";

const meta: Meta<typeof IconButton> = {
  title: "Catalog/Canonical/UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = { args: { "aria-label": "Settings", children: "S" } };
