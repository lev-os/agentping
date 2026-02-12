import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownEditor } from "../../components/migrations/markdown-editor";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Migrations/WebUI/MarkdownEditor",
  component: MarkdownEditor,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {
  args: {},
};
