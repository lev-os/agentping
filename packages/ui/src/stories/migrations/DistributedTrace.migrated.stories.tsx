import type { Meta, StoryObj } from "@storybook/react-vite";
import { DistributedTrace } from "../../components/migrations/distributed-trace";

const meta = {
  title: "Migrations/WebUI/Logs/DistributedTrace",
  component: DistributedTrace,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DistributedTrace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
