import type { Meta, StoryObj } from "@storybook/react";
import { Terminal } from "../../components/migrations/terminal";

const meta = {
  title: "Migrations/Studio/Terminal",
  component: Terminal,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 300 }}><Story /></div>],
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isVisible: true,
    tabs: [
      { id: "1", title: "bash" },
      { id: "2", title: "node" },
    ],
    activeTabId: "1",
    onNewTab: () => {},
    outputLines: [
      "$ npm run dev",
      "",
      "  VITE v5.0.0  ready in 234 ms",
      "",
      "  > Local:   http://localhost:5173/",
      "  > Network: http://192.168.1.100:5173/",
      "",
      "  press h + enter to show help",
    ],
  },
};

export const Empty: Story = {
  args: { isVisible: true, tabs: [{ id: "1", title: "bash" }] },
};
