import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveLogStream } from "../../components/migrations/live-log-stream";

const meta = {
  title: "Migrations/WebUI/Logs/LiveLogStream",
  component: LiveLogStream,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LiveLogStream>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
