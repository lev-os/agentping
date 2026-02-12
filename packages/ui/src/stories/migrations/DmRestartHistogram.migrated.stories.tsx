import type { Meta, StoryObj } from "@storybook/react";
import { DmRestartHistogram } from "../../components/migrations/dm-restart-histogram";

const meta = {
  title: "Migrations/DashboardManager/RestartHistogram",
  component: DmRestartHistogram,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmRestartHistogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Low: Story = { args: { restarts: 2 } };
export const High: Story = { args: { restarts: 15 } };
export const Zero: Story = { args: { restarts: 0 } };

export const Default = Low;
