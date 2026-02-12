import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RestoreDialog } from "../../components/migrations/restore-dialog";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

/**
 * RestoreDialog reads `isRestoreDialogOpen` and `restoringItem` from CrudContext.
 * To render visibly in Storybook, those context values need to be set.
 * This decorator pre-seeds a CrudProvider; the dialog itself calls useCrudContext().
 * Note: Without programmatic context injection the dialog renders as null (hidden).
 * This story confirms the component mounts without error inside its CrudProvider.
 */
const meta: Meta<typeof RestoreDialog> = {
  title: "Migrations/WebUI/Recipes/RestoreDialog",
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

export const Default: Story = {
  args: {},
};
