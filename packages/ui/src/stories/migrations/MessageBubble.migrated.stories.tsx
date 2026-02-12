import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "../../components/migrations/message-bubble";

const meta: Meta<typeof MessageBubble> = {
  title: "Migrations/WebUI/MessageBubble",
  component: MessageBubble,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const Default: Story = {
  args: {},
};
