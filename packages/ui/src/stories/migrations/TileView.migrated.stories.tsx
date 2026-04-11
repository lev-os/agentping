import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TileView } from "../../components/migrations/tile-view";
import { CrudProvider } from "../../components/migrations/crud-context";

const mockConfig = {
  entity: { name: "Agent", plural: "Agents" },
  primaryKey: "id" as const,
  columns: [
    { key: "name" as const, label: "Name" },
    { key: "status" as const, label: "Status" },
  ],
  views: { available: ["tiles" as const], default: "tiles" as const },
};

const mockItems = [
  { id: "1", name: "Agent Alpha", status: "active" },
  { id: "2", name: "Agent Beta", status: "idle" },
  { id: "3", name: "Agent Gamma", status: "error" },
];

const meta: Meta<typeof TileView> = {
  title: "Migrations/WebUI/Recipes/TileView",
  component: TileView,
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
type Story = StoryObj<typeof TileView>;

export const Default: Story = {
  args: {},
};
