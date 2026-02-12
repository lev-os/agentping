import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ListView } from "../../components/recipes/crud/views/ListView";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof ListView> = {
  title: "Migrations/Canonical/Recipes/ListView",
  component: ListView,
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
type Story = StoryObj<typeof ListView>;

export const Default: Story = { args: {} };
