import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { CreateDialog } from "../../components/catalog/create-dialog";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof CreateDialog> = {
  title: "Catalog/WebUI/Recipes/CreateDialog",
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

export const Default: Story = {
  args: {},
};
