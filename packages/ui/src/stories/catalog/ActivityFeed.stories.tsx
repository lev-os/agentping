import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityFeed } from "../../components/catalog/activity-feed";

const meta: Meta<typeof ActivityFeed> = {
  title: "Catalog/WebUI/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {
  args: {
    activities: [
      { id: "1", user: "Alice", action: "deployed", target: "main-service", timestamp: "2 min ago", type: "deploy" },
      { id: "2", user: "Bot", action: "flagged", target: "memory spike", timestamp: "5 min ago", type: "alert" },
    ],
  },
};
