import type { Meta, StoryObj } from "@storybook/react";
import { RadialNav } from "../../components/migrations/radial-nav";

const meta = {
  title: "Migrations/WebUI/Root/RadialNav",
  component: RadialNav,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadialNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
