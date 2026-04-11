import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentStatusOverlay } from "../../components/migrations/agent-status-overlay";

const meta = {
  title: "Migrations/Studio/AgentStatusOverlay",
  component: AgentStatusOverlay,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof AgentStatusOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agents: [
      { sessionId: "1", name: "Code Writer", status: "running", currentTask: "Refactoring auth module", progress: 65 },
      { sessionId: "2", name: "Reviewer", status: "idle" },
      { sessionId: "3", name: "Deployer", status: "complete", currentTask: "Deployed to staging" },
    ],
  },
};
