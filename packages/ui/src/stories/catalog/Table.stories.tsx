import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "../../components/catalog/table";

interface DemoRow { id: string; name: string; status: string; port: number; }

const demoData: DemoRow[] = [
  { id: "1", name: "agentping", status: "online", port: 6006 },
  { id: "2", name: "sofia", status: "online", port: 6007 },
  { id: "3", name: "web-ui", status: "offline", port: 3000 },
  { id: "4", name: "canvas", status: "online", port: 5173 },
  { id: "5", name: "dashboard-mgr", status: "failed", port: 3030 },
];

const meta = {
  title: "Catalog/Studio/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: [
      { key: "name", header: "Name", sortable: true },
      { key: "status", header: "Status", sortable: true },
      { key: "port", header: "Port", sortable: true, align: "right" as const },
    ],
    data: demoData,
    pageSize: 10,
  },
};

export const Loading: Story = {
  args: { columns: [], data: [], loading: true },
};

export const Empty: Story = {
  args: {
    columns: [{ key: "name", header: "Name" }],
    data: [],
    emptyMessage: "No dashboards found",
  },
};
