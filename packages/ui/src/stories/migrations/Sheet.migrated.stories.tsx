import type { Meta, StoryObj } from "@storybook/react";
import { Sheet } from "../../components/migrations/sheet";

const meta: Meta<typeof Sheet> = {
  title: "Migrations/WebUI/Sofia/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  args: {},
};
