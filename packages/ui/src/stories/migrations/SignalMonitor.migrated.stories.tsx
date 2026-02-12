import type { Meta, StoryObj } from "@storybook/react";
import { SignalMonitor } from "../../components/migrations/signal-monitor";

const meta = {
  title: "Migrations/WebUI/System/SignalMonitor",
  component: SignalMonitor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SignalMonitor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
