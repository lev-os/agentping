import type { Meta, StoryObj } from "@storybook/react";
import { MenuList } from "../../components/migrations/menu-list";

const meta: Meta<typeof MenuList> = {
  title: "Migrations/WebUI/Sofia/MenuList",
  component: MenuList,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MenuList>;

export const Default: Story = {
  args: {
    items: [
      { id: "open", label: "Open", description: "Open a file" },
      { id: "save", label: "Save" },
      { id: "export", label: "Export as PDF" },
      { id: "delete", label: "Delete", destructive: true },
    ],
    onSelect: () => {},
  },
};
