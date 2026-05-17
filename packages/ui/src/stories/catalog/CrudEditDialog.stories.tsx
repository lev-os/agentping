import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { EditDialog } from "../../components/recipes/crud/dialogs/EditDialog";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof EditDialog> = {
  title: "Catalog/Canonical/Recipes/EditDialog",
  component: EditDialog,
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
type Story = StoryObj<typeof EditDialog>;

export const Default: Story = { args: {} };
