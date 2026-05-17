import type { Meta, StoryObj } from "@storybook/react-vite";
import { PromptEditor } from "../../components/catalog/prompt-editor";

const meta = {
  title: "Catalog/WebUI/Root/PromptEditor",
  component: PromptEditor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PromptEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
