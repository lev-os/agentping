import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "../../components/migrations/status-indicator";

const meta = {
  title: "Migrations/WebUI/Root/StatusIndicator",
  component: StatusIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
