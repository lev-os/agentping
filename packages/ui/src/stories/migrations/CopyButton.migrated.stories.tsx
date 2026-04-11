import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "../../components/migrations/copy-button";

const meta = {
  title: "Migrations/Studio/CopyButton",
  component: CopyButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Hello, World!", size: 16 },
};

export const Large: Story = {
  args: { text: "npm install @kingly/ui", size: 20 },
};
