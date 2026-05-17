import type { Meta, StoryObj } from "@storybook/react-vite";
import { StreamingIndicator } from "../../components/catalog/streaming-indicator";

const meta: Meta<typeof StreamingIndicator> = {
  title: "Catalog/WebUI/Dashboard/StreamingIndicator",
  component: StreamingIndicator,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StreamingIndicator>;

export const Default: Story = {
  args: {},
};
