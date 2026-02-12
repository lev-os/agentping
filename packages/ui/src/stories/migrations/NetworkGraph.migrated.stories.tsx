import type { Meta, StoryObj } from "@storybook/react";
import { NetworkGraph } from "../../components/migrations/network-graph";

const meta = {
  title: "Migrations/WebUI/Root/NetworkGraph",
  component: NetworkGraph,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
