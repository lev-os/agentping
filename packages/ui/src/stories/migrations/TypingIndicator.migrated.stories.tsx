import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypingIndicator } from "../../components/migrations/typing-indicator";

const meta = {
  title: "Migrations/WebUI/Root/TypingIndicator",
  component: TypingIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TypingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
