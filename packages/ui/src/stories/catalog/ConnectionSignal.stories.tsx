import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConnectionSignal } from "../../components/catalog/connection-signal";

const meta: Meta<typeof ConnectionSignal> = {
  title: "Catalog/WebUI/ConnectionSignal",
  component: ConnectionSignal,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConnectionSignal>;

export const Default: Story = {
  args: { strength: 3 },
};

export const Weak: Story = {
  args: { strength: 1, label: "Weak signal" },
};

export const Full: Story = {
  args: { strength: 4, maxBars: 4 },
};
