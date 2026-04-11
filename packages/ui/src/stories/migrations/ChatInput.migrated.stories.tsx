import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatInput } from "../../components/migrations/chat-input";

const meta = {
  title: "Migrations/Studio/ChatInput",
  component: ChatInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSend: () => {},
    slashCommands: [
      { name: "help", description: "Show available commands" },
      { name: "clear", description: "Clear chat history" },
      { name: "model", description: "Switch AI model" },
    ],
  },
};

export const Sending: Story = {
  args: { isSending: true, value: "Working on the refactor..." },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Connecting..." },
};
