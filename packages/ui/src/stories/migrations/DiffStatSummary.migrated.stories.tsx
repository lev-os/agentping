import type { Meta, StoryObj } from "@storybook/react";
import { DiffStatSummary } from "../../components/migrations/diff-stat-summary";

const meta: Meta<typeof DiffStatSummary> = {
  title: "Migrations/WebUI/DiffStatSummary",
  component: DiffStatSummary,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DiffStatSummary>;

export const Default: Story = {
  args: {},
};
