import type { Meta, StoryObj } from "@storybook/react";
import { StatusCard } from "../../components/migrations/status-card";

const meta = {
  title: "Migrations/WebUI/Root/StatusCard",
  component: StatusCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
