import type { Meta, StoryObj } from "@storybook/react-vite";
import { DistributedTrace } from "../../components/catalog/distributed-trace";

const meta = {
  title: "Catalog/WebUI/Logs/DistributedTrace",
  component: DistributedTrace,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DistributedTrace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
