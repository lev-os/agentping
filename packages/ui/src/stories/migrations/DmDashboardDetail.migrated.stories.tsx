import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmDashboardDetail } from "../../components/migrations/dm-dashboard-detail";

const meta = {
  title: "Migrations/DashboardManager/DashboardDetail",
  component: DmDashboardDetail,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmDashboardDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {
  args: {
    dashboard: {
      id: "grafana-1",
      config: { name: "Grafana", command: "npm start", cwd: "/app/grafana", port_range: [3000, 3100] },
      status: { status: "online", healthy: true, port: 3042, pid: 12345, restartAttempts: 1, startedAt: new Date(Date.now() - 3600000).toISOString() },
    },
    metrics: { uptime_ms: 3600000, restarts: 1 },
    onBack: () => console.log("back"),
    onRestart: async () => console.log("restart"),
    onOpen: () => console.log("open"),
  },
};

export const Failed: Story = {
  args: {
    dashboard: {
      id: "prometheus-1",
      config: { name: "Prometheus", command: "prometheus --config.file=prometheus.yml", cwd: "/app/prom", port_range: [9090, 9099] },
      status: { status: "failed", restartAttempts: 5 },
    },
  },
};

export const Default = Online;
