import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogViewer } from "../../components/catalog/log-viewer";

const meta: Meta<typeof LogViewer> = {
  title: "Catalog/WebUI/LogViewer",
  component: LogViewer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LogViewer>;

export const Default: Story = {
  args: {
    logs: [
      { id: "1", timestamp: "09:00:00", level: "info", message: "System initialized" },
      { id: "2", timestamp: "09:00:05", level: "info", message: "Loading configuration" },
      { id: "3", timestamp: "09:00:12", level: "warn", message: "Deprecated API endpoint detected" },
      { id: "4", timestamp: "09:00:18", level: "error", message: "Connection timeout on port 8080" },
      { id: "5", timestamp: "09:00:25", level: "debug", message: "Retrying with backoff 2s" },
    ],
  },
};
