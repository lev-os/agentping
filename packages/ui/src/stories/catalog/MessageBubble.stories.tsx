import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageBubble } from "../../components/catalog/message-bubble";

const meta: Meta<typeof MessageBubble> = {
  title: "Catalog/WebUI/MessageBubble",
  component: MessageBubble,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const Default: Story = {
  args: {},
};
