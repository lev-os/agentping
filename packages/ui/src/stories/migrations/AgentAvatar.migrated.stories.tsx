import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentAvatar } from "../../components/migrations/agent-avatar";

const meta: Meta<typeof AgentAvatar> = {
  title: "Migrations/WebUI/AgentAvatar",
  component: AgentAvatar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AgentAvatar>;

export const Default: Story = {
  args: {
    name: "Agent Smith",
    status: "idle",
    size: "md",
  },
};

export const Speaking: Story = {
  args: { name: "Nova", status: "speaking", size: "lg" },
};

export const Offline: Story = {
  args: { name: "Deactivated", status: "offline", size: "sm" },
};
