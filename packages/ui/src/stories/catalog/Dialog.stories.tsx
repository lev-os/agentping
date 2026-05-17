// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "../../components/catalog/dialog";

const meta: Meta<typeof Dialog> = {
  title: "Catalog/WebUI/Sofia/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {},
};
