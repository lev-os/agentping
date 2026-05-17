import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertBanner } from "../../components/catalog/alert-banner";

const meta: Meta<typeof AlertBanner> = {
  title: "Catalog/WebUI/AlertBanner",
  component: AlertBanner,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Default: Story = {
  args: {
    message: "System update scheduled for midnight.",
    type: "info",
    title: "Scheduled Maintenance",
  },
};

export const Warning: Story = {
  args: { message: "Memory usage approaching threshold.", type: "warning" },
};

export const Error: Story = {
  args: { message: "Connection to upstream lost.", type: "error", title: "Critical" },
};
