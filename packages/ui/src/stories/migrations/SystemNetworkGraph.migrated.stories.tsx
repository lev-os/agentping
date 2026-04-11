import type { Meta, StoryObj } from "@storybook/react-vite";
import { SystemNetworkGraph } from "../../components/migrations/system-network-graph";

const meta = {
  title: "Migrations/WebUI/System/SystemNetworkGraph",
  component: SystemNetworkGraph,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SystemNetworkGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
