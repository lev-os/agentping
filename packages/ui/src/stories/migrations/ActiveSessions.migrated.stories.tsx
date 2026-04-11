import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActiveSessions } from "../../components/migrations/active-sessions";

const meta: Meta<typeof ActiveSessions> = {
  title: "Migrations/WebUI/ActiveSessions",
  component: ActiveSessions,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ActiveSessions>;

export const Default: Story = {
  args: {
    sessions: [
      { id: "1", user: "alice", ip: "192.168.1.1", duration: "2h 15m", device: "Chrome", status: "active" },
      { id: "2", user: "bob", ip: "10.0.0.5", duration: "45m", device: "Firefox", status: "idle" },
    ],
  },
};
