import type { Meta, StoryObj } from "@storybook/react";
import { ProcessTable } from "../../components/migrations/process-table";

const meta = {
  title: "Migrations/WebUI/System/ProcessTable",
  component: ProcessTable,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ProcessTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
