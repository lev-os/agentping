import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "../../components/migrations/data-table";

const meta: Meta<typeof DataTable> = {
  title: "Migrations/WebUI/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    columns: [
      { key: "name", header: "Name", sortable: true },
      { key: "status", header: "Status" },
      { key: "uptime", header: "Uptime", sortable: true },
    ],
    data: [
      { name: "agent-01", status: "online", uptime: "4h 23m" },
      { name: "agent-02", status: "offline", uptime: "0m" },
      { name: "agent-03", status: "online", uptime: "12h 5m" },
    ],
  },
};
