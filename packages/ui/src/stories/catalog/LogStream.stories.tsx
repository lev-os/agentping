import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogStream } from "../../components/catalog/log-stream";

const meta: Meta<typeof LogStream> = {
  title: "Catalog/WebUI/LogStream",
  component: LogStream,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LogStream>;

export const Default: Story = {
  args: {
    entries: [
      { id: "1", timestamp: "09:00:00", level: "info", message: "Stream connected" },
      { id: "2", timestamp: "09:00:03", level: "debug", message: "Heartbeat received" },
      { id: "3", timestamp: "09:00:07", level: "warn", message: "Slow response from upstream" },
      { id: "4", timestamp: "09:00:12", level: "error", message: "Timeout exceeded for /api/v2/status" },
      { id: "5", timestamp: "09:00:15", level: "info", message: "Reconnecting..." },
    ],
  },
};
