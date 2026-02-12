import type { Meta, StoryObj } from "@storybook/react";
import { Knob } from "../../components/migrations/knob";

const meta: Meta<typeof Knob> = {
  title: "Migrations/WebUI/Knob",
  component: Knob,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Knob>;

export const Default: Story = {
  args: {},
};
