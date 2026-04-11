import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "../../components/migrations/kbd";

const meta = {
  title: "Migrations/Studio/Kbd",
  component: Kbd,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { keys: "Mod+K" },
};

export const Complex: Story = {
  args: { keys: "Mod+Shift+Z" },
};

export const SingleKey: Story = {
  args: { keys: "V" },
};
