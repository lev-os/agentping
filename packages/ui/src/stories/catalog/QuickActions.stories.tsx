import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickActions } from "../../components/catalog/quick-actions";

const meta = {
  title: "Catalog/WebUI/Root/QuickActions",
  component: QuickActions,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      { id: "1", label: "Approve", icon: "\u2705", shortcut: "\u2318A" },
      { id: "2", label: "Reject", icon: "\u274C", shortcut: "\u2318R" },
      { id: "3", label: "Inspect", icon: "\uD83D\uDD0D" },
      { id: "4", label: "Forward", icon: "\u27A1\uFE0F" },
    ],
  },
};
