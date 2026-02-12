import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "../../components/migrations/tooltip";

const meta = {
  title: "Migrations/Studio/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ position: "relative", padding: "80px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Select tool", shortcut: "V", position: "top" },
};

export const Bottom: Story = {
  args: { text: "Save file", shortcut: "Cmd+S", position: "bottom" },
};

export const NoShortcut: Story = {
  args: { text: "Click to expand", position: "right" },
};
