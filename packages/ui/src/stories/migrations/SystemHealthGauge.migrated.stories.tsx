import type { Meta, StoryObj } from "@storybook/react";
import { SystemHealthGauge } from "../../components/migrations/system-health-gauge";

const meta = {
  title: "Migrations/WebUI/System/SystemHealthGauge",
  component: SystemHealthGauge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SystemHealthGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
