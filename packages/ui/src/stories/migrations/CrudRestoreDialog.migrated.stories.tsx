import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RestoreDialog } from "../../components/recipes/crud/dialogs/RestoreDialog";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof RestoreDialog> = {
  title: "Migrations/Canonical/Recipes/RestoreDialog",
  component: RestoreDialog,
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
type Story = StoryObj<typeof RestoreDialog>;

export const Default: Story = { args: {} };
