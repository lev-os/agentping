import type { Meta, StoryObj } from "@storybook/react";
import { AlertFeed } from "../../components/migrations/alert-feed";

const meta = {
  title: "Migrations/WebUI/Logs/AlertFeed",
  component: AlertFeed,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Alerts",
    alerts: [
      { id: "1", severity: "critical", title: "Memory Alert", message: "Memory usage above 90%", timestamp: "2 min ago", source: "monitor-agent" },
      { id: "2", severity: "low", title: "Deployment", message: "New deployment detected", timestamp: "10 min ago", source: "deploy-bot" },
      { id: "3", severity: "high", title: "Latency Spike", message: "API latency spike on /v2/query", timestamp: "15 min ago", source: "apm-service" },
    ],
  },
};
