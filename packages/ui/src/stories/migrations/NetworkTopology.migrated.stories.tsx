import type { Meta, StoryObj } from "@storybook/react";
import { NetworkTopology } from "../../components/migrations/network-topology";

const meta = {
  title: "Migrations/WebUI/Root/NetworkTopology",
  component: NetworkTopology,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkTopology>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
