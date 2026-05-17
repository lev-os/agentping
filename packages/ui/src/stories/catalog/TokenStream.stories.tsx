import type { Meta, StoryObj } from "@storybook/react-vite";
import { TokenStream } from "../../components/catalog/token-stream";

const meta = {
  title: "Catalog/WebUI/Root/TokenStream",
  component: TokenStream,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TokenStream>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokens: ["Hello", " ", "world", ", ", "this", " ", "is", " ", "a", " ", "streaming", " ", "response", "."],
    isStreaming: false,
  },
};

export const Streaming: Story = {
  args: {
    tokens: ["The", " ", "quick", " ", "brown", " ", "fox", " ", "jumps", " ", "over", " ", "the", " ", "lazy", " ", "dog", "."],
    speed: 80,
    isStreaming: true,
  },
};

export const Empty: Story = {
  args: { tokens: [], isStreaming: false },
};
