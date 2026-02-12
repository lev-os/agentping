import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "../../components/migrations/hover-card";

const meta: Meta<typeof HoverCard> = {
  title: "Migrations/WebUI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  args: {},
};
