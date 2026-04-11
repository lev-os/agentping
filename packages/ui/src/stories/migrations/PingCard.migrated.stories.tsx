import type { Meta, StoryObj } from "@storybook/react-vite";
import { PingCard } from "../../components/migrations/ping-card";

const meta = {
  title: "Migrations/WebUI/Root/PingCard",
  component: PingCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ping: {
      id: "ping-001",
      type: "approval",
      payload: { title: "Deploy v2.1 to production" },
      createdAt: "2m ago",
    },
  },
};
