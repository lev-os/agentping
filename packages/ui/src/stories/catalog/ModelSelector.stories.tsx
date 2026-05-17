import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModelSelector } from "../../components/catalog/model-selector";

const meta: Meta<typeof ModelSelector> = {
  title: "Catalog/WebUI/ModelSelector",
  component: ModelSelector,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ModelSelector>;

export const Default: Story = {
  args: {
    models: [
      { id: "gpt-4", name: "GPT-4", provider: "OpenAI", description: "Most capable model" },
      { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic" },
      { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
    ],
    selected: "gpt-4",
  },
};
