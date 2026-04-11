import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsModal } from "../../components/migrations/settings-modal";

const meta = {
  title: "Migrations/Studio/SettingsModal",
  component: SettingsModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    settings: { model: "claude-opus-4-6", maxTurns: 25, autoApprove: false },
    onSave: () => {},
  },
};
