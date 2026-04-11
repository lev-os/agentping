// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabBar } from "../../components/migrations/tab-bar";

const meta: Meta<typeof TabBar> = {
  title: "Migrations/WebUI/Sofia/TabBar",
  component: TabBar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "metrics", label: "Metrics" },
      { id: "logs", label: "Logs" },
      { id: "settings", label: "Settings", disabled: true },
    ],
    activeTab: "overview",
    onTabChange: () => {},
  },
};
