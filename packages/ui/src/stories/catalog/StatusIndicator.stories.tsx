import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicator } from "../../components/catalog/status-indicator";

const meta = {
  title: "Catalog/WebUI/Root/StatusIndicator",
  component: StatusIndicator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
