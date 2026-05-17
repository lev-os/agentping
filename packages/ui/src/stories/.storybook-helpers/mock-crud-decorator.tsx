import React from "react";
import { CrudProvider } from "../../components/catalog/crud-context";

export const mockCrudConfig = {
  entity: { name: "Agent", plural: "Agents" },
  primaryKey: "id" as const,
  columns: [
    { key: "name" as const, label: "Name" },
    { key: "status" as const, label: "Status" },
  ],
  fields: [
    { key: "name" as const, label: "Name", type: "text" as const, required: true },
    { key: "status" as const, label: "Status", type: "select" as const, options: [
      { label: "Active", value: "active" },
      { label: "Idle", value: "idle" },
      { label: "Error", value: "error" },
    ]},
  ],
  views: {
    available: ["table" as const, "tiles" as const],
    default: "table" as const,
    tileConfig: {
      title: "name" as const,
      subtitle: "status" as const,
    },
  },
};

export const mockCrudItems = [
  { id: "1", name: "Agent Alpha", status: "active" },
  { id: "2", name: "Agent Beta", status: "idle" },
  { id: "3", name: "Agent Gamma", status: "error" },
];

export const withCrudProvider = (Story: React.ComponentType) => (
  <CrudProvider config={mockCrudConfig} initialItems={mockCrudItems}>
    <Story />
  </CrudProvider>
);
