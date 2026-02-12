import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmationModal } from "../../components/migrations/confirmation-modal";

const meta: Meta<typeof ConfirmationModal> = {
  title: "Migrations/WebUI/ConfirmationModal",
  component: ConfirmationModal,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Delete Agent",
    message: "Are you sure you want to delete this agent? This action cannot be undone.",
    variant: "destructive",
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const NonDestructive: Story = {
  args: {
    isOpen: true,
    title: "Archive Workflow",
    message: "This workflow will be moved to the archive. You can restore it later.",
    onConfirm: () => {},
    onCancel: () => {},
  },
};
