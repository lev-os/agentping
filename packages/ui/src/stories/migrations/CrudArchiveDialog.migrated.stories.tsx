import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ArchiveDialog } from "../../components/recipes/crud/dialogs/ArchiveDialog";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof ArchiveDialog> = {
  title: "Migrations/Canonical/Recipes/ArchiveDialog",
  component: ArchiveDialog,
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
type Story = StoryObj<typeof ArchiveDialog>;

export const Default: Story = { args: {} };
