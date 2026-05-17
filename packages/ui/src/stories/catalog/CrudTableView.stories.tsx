import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TableView } from "../../components/recipes/crud/views/TableView";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof TableView> = {
  title: "Catalog/Canonical/Recipes/TableView",
  component: TableView,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <CrudProvider config={mockCrudConfig} initialItems={mockCrudItems}>
        <Story />
      </CrudProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TableView>;

export const Default: Story = { args: {} };
