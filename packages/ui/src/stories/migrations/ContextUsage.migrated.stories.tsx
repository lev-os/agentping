import type { Meta, StoryObj } from "@storybook/react";
import { ContextUsage } from "../../components/migrations/context-usage";

const meta: Meta<typeof ContextUsage> = {
  title: "Migrations/WebUI/ContextUsage",
  component: ContextUsage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ContextUsage>;

export const Default: Story = {
  args: {
    used: 72000,
    total: 128000,
    label: "Context Window",
  },
};

export const NearLimit: Story = {
  args: { used: 120000, total: 128000, label: "Tokens" },
};
