import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownCard } from "../../components/migrations/markdown-card";

const meta = {
  title: "Migrations/Canvas/MarkdownCard",
  component: MarkdownCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof MarkdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Release Notes", content: "## v2.0\n\n- Added polymorph renderer\n- Fixed canvas drag-drop\n- Improved theme tokens" },
};

export const Empty: Story = { args: { title: "Empty Card" } };
