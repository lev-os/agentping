import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { EntityForm } from "../../components/migrations/entity-form";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof EntityForm> = {
  title: "Migrations/WebUI/Recipes/EntityForm",
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

export const Default: Story = {
  args: {},
};
