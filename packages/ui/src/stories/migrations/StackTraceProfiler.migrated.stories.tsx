import type { Meta, StoryObj } from "@storybook/react";
import { StackTraceProfiler } from "../../components/migrations/stack-trace-profiler";

const meta = {
  title: "Migrations/WebUI/Logs/StackTraceProfiler",
  component: StackTraceProfiler,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StackTraceProfiler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
