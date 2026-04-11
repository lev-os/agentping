import type { Meta, StoryObj } from "@storybook/react-vite";
import { PacketInspector } from "../../components/migrations/packet-inspector";

const meta = {
  title: "Migrations/WebUI/System/PacketInspector",
  component: PacketInspector,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PacketInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
