import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "../../components/migrations/chat-header";

const meta = {
  title: "Migrations/Studio/ChatHeader",
  component: ChatHeader,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Claude Opus", turnCount: 12, workspacePath: "/Users/dev/myproject" },
};

export const Editable: Story = {
  args: { title: "My Session", turnCount: 5, editable: true, onRename: () => {} },
};
