import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoverCard } from "../../components/catalog/hover-card";

const meta: Meta<typeof HoverCard> = {
  title: "Catalog/WebUI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  args: {},
};
