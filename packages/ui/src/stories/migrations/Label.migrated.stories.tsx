import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../../components/migrations/label";

const meta: Meta<typeof Label> = {
  title: "Migrations/WebUI/Sofia/Label",
  component: Label,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Agent Name",
  },
};
