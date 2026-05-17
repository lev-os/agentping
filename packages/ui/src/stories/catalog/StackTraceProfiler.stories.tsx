import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackTraceProfiler } from "../../components/catalog/stack-trace-profiler";

const meta = {
  title: "Catalog/WebUI/Logs/StackTraceProfiler",
  component: StackTraceProfiler,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StackTraceProfiler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
