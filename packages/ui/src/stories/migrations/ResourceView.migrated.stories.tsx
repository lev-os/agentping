import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResourceView } from "../../components/migrations/resource-view";

const meta = {
  title: "Migrations/WebUI/Root/ResourceView",
  component: ResourceView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ResourceView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    resources: [
      { label: "CPU", current: 67, max: 100, unit: "%" },
      { label: "Memory", current: 12400, max: 16384, unit: "MB" },
      { label: "Disk", current: 380, max: 512, unit: "GB" },
      { label: "Network", current: 245, max: 1000, unit: "Mbps" },
    ],
  },
};

export const CriticalLoad: Story = {
  args: {
    resources: [
      { label: "CPU", current: 95, max: 100, unit: "%" },
      { label: "Memory", current: 15800, max: 16384, unit: "MB" },
      { label: "Disk", current: 490, max: 512, unit: "GB" },
      { label: "GPU", current: 88, max: 100, unit: "%" },
    ],
  },
};
