import type { Meta, StoryObj } from "@storybook/react";
import { SidePanel } from "../../components/migrations/side-panel";

const meta = {
  title: "Migrations/WebUI/Root/SidePanel",
  component: SidePanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Details Panel",
    side: "right",
    width: 360,
  },
};

export const LeftSide: Story = {
  args: {
    isOpen: true,
    title: "Navigation",
    side: "left",
    width: 280,
  },
};

export const Closed: Story = {
  args: { isOpen: false },
};
