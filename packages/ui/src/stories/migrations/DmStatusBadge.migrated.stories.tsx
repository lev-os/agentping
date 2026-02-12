import type { Meta, StoryObj } from "@storybook/react";
import { DmStatusBadge } from "../../components/migrations/dm-status-badge";

const meta = {
  title: "Migrations/DashboardManager/StatusBadge",
  component: DmStatusBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = { args: { status: "online", healthy: true } };
export const Unhealthy: Story = { args: { status: "online", healthy: false } };
export const Starting: Story = { args: { status: "starting" } };
export const Failed: Story = { args: { status: "failed" } };
export const Stopped: Story = { args: { status: "stopped" } };

export const Default = Online;
