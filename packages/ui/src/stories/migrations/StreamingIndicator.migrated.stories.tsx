import type { Meta, StoryObj } from "@storybook/react";
import { StreamingIndicator } from "../../components/migrations/streaming-indicator";

const meta: Meta<typeof StreamingIndicator> = {
  title: "Migrations/WebUI/Dashboard/StreamingIndicator",
  component: StreamingIndicator,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StreamingIndicator>;

export const Default: Story = {
  args: {},
};
