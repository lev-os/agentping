import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigatorWithDashboards } from "../../components/catalog/navigator-with-dashboards";

const meta = {
  title: "Catalog/Studio/NavigatorWithDashboards",
  component: NavigatorWithDashboards,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 600 }}><Story /></div>],
} satisfies Meta<typeof NavigatorWithDashboards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dashboards: [
      { id: "agentping", name: "AgentPing", url: "http://localhost:6006", port: 6006, status: "online", description: "Component gallery" },
      { id: "sofia", name: "Sofia", url: "http://localhost:6007", port: 6007, status: "online", description: "Sofia Storybook" },
      { id: "web-ui", name: "Web UI", url: "http://localhost:3000", port: 3000, status: "offline", description: "AgentPing web adapter" },
      { id: "canvas", name: "Canvas", url: "http://localhost:5173", port: 5173, status: "failed", description: "Canvas renderer", restartAttempts: 2 },
    ],
    onSelectDashboard: () => {},
    onOpenDashboard: () => {},
    onRestartDashboard: () => {},
  },
};

export const Loading: Story = { args: { loading: true } };
export const WithError: Story = { args: { error: "Connection refused", dashboards: [] } };
