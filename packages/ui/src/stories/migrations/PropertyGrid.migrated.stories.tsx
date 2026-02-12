import type { Meta, StoryObj } from "@storybook/react";
import { PropertyGrid } from "../../components/migrations/property-grid";

const meta = {
  title: "Migrations/WebUI/Root/PropertyGrid",
  component: PropertyGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PropertyGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Node Properties",
    items: [
      { key: "status", value: "running", category: "runtime" },
      { key: "uptime", value: 3600, category: "runtime" },
      { key: "version", value: "2.1.0", category: "meta" },
      { key: "healthy", value: true, category: "health" },
    ],
  },
};
