import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatSearch } from "../../components/migrations/chat-search";

const meta = {
  title: "Migrations/Studio/ChatSearch",
  component: ChatSearch,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    messages: [
      { id: "1", content: "Help me with TypeScript generics", role: "user" },
      { id: "2", content: "TypeScript generics allow you to create reusable components", role: "assistant" },
      { id: "3", content: "Can you show an example with constraints?", role: "user" },
    ],
  },
};
