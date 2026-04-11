import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentDropdown } from "../../components/migrations/agent-dropdown";

const meta = {
  title: "Migrations/Studio/AgentDropdown",
  component: AgentDropdown,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AgentDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agents: [
      { sessionId: "s1", name: "Claude Opus", status: "running", model: "opus-4.6" },
      { sessionId: "s2", name: "Researcher", status: "idle", model: "sonnet-4.5" },
      { sessionId: "s3", name: "Tester", status: "error", model: "haiku-4.5" },
    ],
    activeSessionId: "s1",
    onSelectAgent: () => {},
    onCreateAgent: () => {},
    onTerminateAgent: () => {},
  },
};

export const Empty: Story = {
  args: { agents: [], onCreateAgent: () => {} },
};
