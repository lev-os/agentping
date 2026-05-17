import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownEditor } from "../../components/catalog/markdown-editor";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Catalog/WebUI/MarkdownEditor",
  component: MarkdownEditor,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {
  args: {},
};
