import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashboardDetailView } from "../../components/catalog/dashboard-detail-view";

const meta = {
  title: "Catalog/Studio/DashboardDetailView",
  component: DashboardDetailView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 600 }}><Story /></div>],
} satisfies Meta<typeof DashboardDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dashboardId: "agentping",
    name: "AgentPing Storybook",
    metrics: { uptime: "12h 34m", restartCount: 2, avgResponseTime: "45ms", status: "online", port: 6006, url: "http://localhost:6006" },
    onBack: () => {},
    onOpenExternal: () => {},
    onRestart: () => {},
  },
};

export const Loading: Story = { args: { dashboardId: "sofia", loading: true, onBack: () => {} } };
