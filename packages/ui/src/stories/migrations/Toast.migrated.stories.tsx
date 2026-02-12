import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastContainer } from "../../components/migrations/toast";

const meta = {
  title: "Migrations/Studio/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { variant: "success", title: "File saved", description: "Changes saved to disk", duration: 0 },
};

export const Error: Story = {
  args: { variant: "error", title: "Connection failed", description: "Could not reach API server", duration: 0 },
};

export const Warning: Story = {
  args: { variant: "warning", title: "Memory high", description: "Usage at 85% — consider closing tabs", duration: 0 },
};

export const Info: Story = {
  args: { variant: "info", title: "Agent started", description: "Claude Opus session initialized", duration: 0 },
};

export const WithAction: Story = {
  args: {
    variant: "error",
    title: "Build failed",
    description: "TypeScript errors in 3 files",
    action: { label: "View errors", onClick: () => {} },
    duration: 0,
  },
};

export const Default = Success;
