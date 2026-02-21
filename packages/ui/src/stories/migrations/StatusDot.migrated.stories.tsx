// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { StatusDot } from "../../components/migrations/status-dot";

const meta: Meta<typeof StatusDot> = {
  title: "Migrations/WebUI/Sofia/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: {},
};
