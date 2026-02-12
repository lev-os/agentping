import type { Meta, StoryObj } from "@storybook/react";
import { ToastManager } from "../../components/migrations/toast-manager";

const meta = {
  title: "Migrations/WebUI/Root/ToastManager",
  component: ToastManager,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToastManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    toasts: [
      { id: "1", message: "Deployment completed successfully", type: "success" },
      { id: "2", message: "New version available", type: "info" },
      { id: "3", message: "Rate limit approaching", type: "warning" },
    ],
    position: "top-right",
  },
};

export const Errors: Story = {
  args: {
    toasts: [
      { id: "1", message: "Connection lost", type: "error" },
      { id: "2", message: "Authentication failed", type: "error" },
    ],
    position: "bottom-right",
  },
};
