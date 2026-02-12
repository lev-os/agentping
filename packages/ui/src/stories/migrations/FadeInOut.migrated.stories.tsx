import type { Meta, StoryObj } from "@storybook/react";
import { FadeInOut } from "../../components/migrations/animations";

const meta: Meta<typeof FadeInOut> = {
  title: "Migrations/WebUI/Sofia/FadeInOut",
  component: FadeInOut,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FadeInOut>;

export const Default: Story = {
  args: {},
};
