import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatPanel } from "../../components/migrations/chat-panel";

const meta = {
  title: "Migrations/Studio/ChatPanel",
  component: ChatPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 600 }}><Story /></div>],
} satisfies Meta<typeof ChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    messages: [
      { id: "1", role: "user", content: "Help me refactor the auth module", timestamp: new Date() },
      { id: "2", role: "assistant", content: "I'll analyze the auth module and suggest improvements. Let me start by reading the relevant files.", timestamp: new Date() },
    ],
    isConnected: true,
    workspacePath: "/Users/dev/project",
    onSendMessage: () => {},
  },
};

export const Empty: Story = {
  args: { messages: [], isConnected: true, onSendMessage: () => {} },
};

export const Disconnected: Story = {
  args: { messages: [], isConnected: false },
};
