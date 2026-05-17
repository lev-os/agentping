import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ViewSwitcher } from "../../components/catalog/view-switcher";
import { CrudProvider } from "../../components/catalog/crud-context";

const mockConfig = {
  entity: { name: "Agent", plural: "Agents" },
  primaryKey: "id" as const,
  columns: [
    { key: "name" as const, label: "Name" },
    { key: "status" as const, label: "Status" },
  ],
  views: { available: ["table" as const, "tiles" as const], default: "table" as const },
};

const mockItems = [
  { id: "1", name: "Agent Alpha", status: "active" },
  { id: "2", name: "Agent Beta", status: "idle" },
];

const meta: Meta<typeof ViewSwitcher> = {
  title: "Catalog/WebUI/Recipes/ViewSwitcher",
  component: ViewSwitcher,
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
type Story = StoryObj<typeof ViewSwitcher>;

export const Default: Story = {
  args: {},
};
