import type { Meta, StoryObj } from "@storybook/react";
import { DockMenu } from "../../components/migrations/dock-menu";

const meta: Meta<typeof DockMenu> = {
  title: "Migrations/WebUI/DockMenu",
  component: DockMenu,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DockMenu>;

export const Default: Story = {
  args: {
    items: [
      { id: "home", label: "Home", icon: "H" },
      { id: "search", label: "Search", icon: "S" },
      { id: "settings", label: "Settings", icon: "G" },
    ],
  },
};
