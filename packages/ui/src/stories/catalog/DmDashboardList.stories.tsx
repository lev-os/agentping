import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmDashboardList } from "../../components/catalog/dm-dashboard-list";

const meta = {
  title: "Catalog/DashboardManager/DashboardList",
  component: DmDashboardList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmDashboardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dashboards: [
      { id: "grafana-1", config: { name: "Grafana", port_range: [3000, 3100] }, status: { status: "online", healthy: true, port: 3042, pid: 12345, restartAttempts: 0, startedAt: new Date(Date.now() - 7200000).toISOString() } },
      { id: "prom-1", config: { name: "Prometheus", port_range: [9090, 9099] }, status: { status: "failed", restartAttempts: 3 } },
    ],
    onViewDetails: (id: string) => console.log("view:", id),
    onCreateNew: () => console.log("create"),
  },
};

export const Empty: Story = {
  args: { dashboards: [], onCreateNew: () => console.log("create") },
};

export const Loading: Story = {
  args: { dashboards: [], isLoading: true },
};
