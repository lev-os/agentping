import type { Meta, StoryObj } from "@storybook/react";
import { GlowOrb } from "../../components/migrations/glow-orb";

const meta: Meta<typeof GlowOrb> = {
  title: "Migrations/WebUI/Sofia/GlowOrb",
  component: GlowOrb,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GlowOrb>;

export const Default: Story = {
  args: {},
};
