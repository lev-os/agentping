import type { Meta, StoryObj } from "@storybook/react";
import { SmartActionResult } from "../../components/migrations/smart-action-result";

const meta = {
  title: "Migrations/WebUI/Root/SmartActionResult",
  component: SmartActionResult,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SmartActionResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
