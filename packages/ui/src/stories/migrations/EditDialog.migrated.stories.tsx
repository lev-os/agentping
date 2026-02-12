import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EditDialog } from "../../components/migrations/edit-dialog";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof EditDialog> = {
  title: "Migrations/WebUI/Recipes/EditDialog",
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

export const Default: Story = {
  args: {},
};
