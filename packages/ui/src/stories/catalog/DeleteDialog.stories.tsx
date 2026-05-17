import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { DeleteDialog } from "../../components/catalog/delete-dialog";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof DeleteDialog> = {
  title: "Catalog/WebUI/Recipes/DeleteDialog",
  component: DeleteDialog,
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
type Story = StoryObj<typeof DeleteDialog>;

export const Default: Story = {
  args: {},
};
