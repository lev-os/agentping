import type { Meta, StoryObj } from "@storybook/react-vite";
import { SmartActionResult } from "../../components/catalog/smart-action-result";

const meta = {
  title: "Catalog/WebUI/Root/SmartActionResult",
  component: SmartActionResult,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SmartActionResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
