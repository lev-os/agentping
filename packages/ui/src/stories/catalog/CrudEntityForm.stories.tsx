import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { EntityForm } from "../../components/recipes/crud/forms/EntityForm";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof EntityForm> = {
  title: "Catalog/Canonical/Recipes/EntityForm",
  component: EntityForm,
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
type Story = StoryObj<typeof EntityForm>;

export const Create: Story = {
  args: {
    onSubmit: async (data: unknown) => { console.log("submit", data); },
  },
};

export const Edit: Story = {
  args: {
    initialData: { name: "Agent Alpha", status: "active" },
    onSubmit: async (data: unknown) => { console.log("submit", data); },
    onCancel: () => { console.log("cancel"); },
  },
};
