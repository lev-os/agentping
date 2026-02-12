import type { Meta, StoryObj } from "@storybook/react";
import { AccessPad } from "../../components/migrations/access-pad";

const meta = {
  title: "Migrations/WebUI/System/AccessPad",
  component: AccessPad,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AccessPad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
