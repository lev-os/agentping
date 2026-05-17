import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiagnosticPanel } from "../../components/catalog/diagnostic-panel";

const meta = {
  title: "Catalog/Studio/DiagnosticPanel",
  component: DiagnosticPanel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DiagnosticPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tests: [
      { id: "1", name: "Claude Code Connection", status: "pass", latency: 42 },
      { id: "2", name: "MCP Server", status: "pass", latency: 15 },
      { id: "3", name: "File System Access", status: "pass", latency: 3 },
      { id: "4", name: "Terminal Bridge", status: "fail", message: "Connection timeout after 5000ms" },
      { id: "5", name: "Dashboard API", status: "running" },
    ],
    onRunTests: () => {},
  },
};

export const AllPassed: Story = {
  args: {
    tests: [
      { id: "1", name: "Claude Code", status: "pass", latency: 38 },
      { id: "2", name: "MCP Server", status: "pass", latency: 12 },
      { id: "3", name: "File System", status: "pass", latency: 2 },
    ],
  },
};
