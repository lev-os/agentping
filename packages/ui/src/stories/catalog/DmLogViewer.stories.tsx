import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmLogViewer } from "../../components/catalog/dm-log-viewer";

const meta = {
  title: "Catalog/DashboardManager/LogViewer",
  component: DmLogViewer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmLogViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLogs: Story = {
  args: {
    dashboardId: "grafana-1",
    logs: [
      { line: "Server started on port 3000", stream: "stdout", timestamp: new Date().toISOString() },
      { line: "Connected to database", stream: "stdout", timestamp: new Date().toISOString() },
      { line: "Warning: deprecated API used", stream: "stderr", timestamp: new Date().toISOString() },
    ],
  },
};

export const Empty: Story = {
  args: { dashboardId: "grafana-1", logs: [] },
};

export const Default = WithLogs;
