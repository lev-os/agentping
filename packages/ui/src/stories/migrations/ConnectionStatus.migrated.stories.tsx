import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionStatus } from "../../components/migrations/connection-status";

const meta = {
  title: "Migrations/Canvas/ConnectionStatus",
  component: ConnectionStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = { args: { connected: true } };
export const Disconnected: Story = { args: { connected: false } };
