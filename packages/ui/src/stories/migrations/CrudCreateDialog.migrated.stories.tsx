import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CreateDialog } from "../../components/recipes/crud/dialogs/CreateDialog";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof CreateDialog> = {
  title: "Migrations/Canonical/Recipes/CreateDialog",
  component: CreateDialog,
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
type Story = StoryObj<typeof CreateDialog>;

export const Default: Story = { args: {} };
