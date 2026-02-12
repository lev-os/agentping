import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "../../components/migrations/dialog";

const meta: Meta<typeof Dialog> = {
  title: "Migrations/WebUI/Sofia/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {},
};
