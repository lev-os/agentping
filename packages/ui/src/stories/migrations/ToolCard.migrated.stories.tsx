import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolCard } from "../../components/migrations/tool-card";

const meta = {
  title: "Migrations/Studio/ToolCard",
  component: ToolCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    tool: {
      id: "1",
      name: "Edit",
      status: "pending",
      input: { file_path: "/src/App.tsx", old_string: "foo", new_string: "bar" },
    },
    onApprove: () => {},
    onReject: () => {},
  },
};

export const Running: Story = {
  args: { tool: { id: "2", name: "Bash", status: "running" } },
};

export const Success: Story = {
  args: {
    tool: { id: "3", name: "Read", status: "success", result: "File contents here...", duration: 42 },
  },
};

export const Error: Story = {
  args: {
    tool: { id: "4", name: "Write", status: "error", result: "Permission denied" },
  },
};

export const Default = Pending;
