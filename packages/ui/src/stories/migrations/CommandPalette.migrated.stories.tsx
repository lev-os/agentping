import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "../../components/migrations/command-palette";

const meta: Meta<typeof CommandPalette> = {
  title: "Migrations/WebUI/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    commands: [
      { id: "1", label: "New Agent", shortcut: "Ctrl+N", action: () => {} },
      { id: "2", label: "Search", shortcut: "Ctrl+K", action: () => {} },
      { id: "3", label: "Settings", shortcut: "Ctrl+,", action: () => {} },
      { id: "4", label: "Deploy", action: () => {} },
    ],
  },
};
