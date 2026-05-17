import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatMessage } from "../../components/catalog/chat-message";

const meta = {
  title: "Catalog/Studio/ChatMessage",
  component: ChatMessage,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    message: {
      id: "1",
      role: "user",
      content: "Can you help me refactor this component?",
      timestamp: new Date(),
    },
  },
};

export const AssistantMessage: Story = {
  args: {
    message: {
      id: "2",
      role: "assistant",
      content: "Sure! I'll analyze the component structure and suggest improvements.\n\nHere's what I found:\n1. The component has too many responsibilities\n2. State management can be simplified\n3. Some props are unused",
      timestamp: new Date(),
    },
  },
};

export const WithToolUse: Story = {
  args: {
    message: {
      id: "3",
      role: "assistant",
      content: "Let me read the file first.",
      timestamp: new Date(),
      toolUse: [
        { id: "t1", name: "Read", status: "success" },
        { id: "t2", name: "Edit", status: "running" },
      ],
    },
  },
};

export const Streaming: Story = {
  args: {
    message: { id: "4", role: "assistant", content: "", isStreaming: true },
  },
};

export const SystemMessage: Story = {
  args: {
    message: { id: "5", role: "system", content: "Session started" },
  },
};
