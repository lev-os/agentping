import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabsContainer } from "../../components/migrations/tabs-container";

const meta = {
  title: "Migrations/WebUI/Root/TabsContainer",
  component: TabsContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TabsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "logs", label: "Logs" },
      { id: "settings", label: "Settings" },
    ],
    activeTab: "overview",
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: "1", label: "General" },
      { id: "2", label: "Security" },
      { id: "3", label: "Integrations" },
      { id: "4", label: "Billing" },
      { id: "5", label: "Team" },
    ],
    activeTab: "3",
  },
};
