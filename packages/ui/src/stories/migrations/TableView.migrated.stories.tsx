import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TableView } from "../../components/migrations/table-view";
import { CrudProvider } from "../../components/migrations/crud-context";

const mockConfig = {
  entity: { name: "Agent", plural: "Agents" },
  primaryKey: "id" as const,
  columns: [
    { key: "name" as const, label: "Name" },
    { key: "status" as const, label: "Status" },
  ],
  views: { available: ["table" as const], default: "table" as const },
};

const mockItems = [
  { id: "1", name: "Agent Alpha", status: "active" },
  { id: "2", name: "Agent Beta", status: "idle" },
  { id: "3", name: "Agent Gamma", status: "error" },
];

const meta: Meta<typeof TableView> = {
  title: "Migrations/WebUI/Recipes/TableView",
  component: TableView,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <CrudProvider config={mockConfig} initialItems={mockItems}>
        <Story />
      </CrudProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TableView>;

export const Default: Story = {
  args: {},
};
