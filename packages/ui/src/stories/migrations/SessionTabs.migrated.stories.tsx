import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionTabs } from "../../components/migrations/session-tabs";

const meta = {
  title: "Migrations/Studio/SessionTabs",
  component: SessionTabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SessionTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    agents: [
      { sessionId: "s1", name: "Claude", status: "running" },
      { sessionId: "s2", name: "Researcher", status: "idle" },
      { sessionId: "s3", name: "Tester", status: "error" },
    ],
    activeSession: "s1",
    onSelectSession: () => {},
    onNewSession: () => {},
    onCloseSession: () => {},
  },
};
