// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlowOrb } from "../../components/catalog/glow-orb";

const meta: Meta<typeof GlowOrb> = {
  title: "Catalog/WebUI/Sofia/GlowOrb",
  component: GlowOrb,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GlowOrb>;

export const Default: Story = {
  args: {},
};
