import type { Meta, StoryObj } from "@storybook/react-vite";
import { NetworkTopology } from "../../components/catalog/network-topology";

const meta = {
  title: "Catalog/WebUI/Root/NetworkTopology",
  component: NetworkTopology,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof NetworkTopology>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
