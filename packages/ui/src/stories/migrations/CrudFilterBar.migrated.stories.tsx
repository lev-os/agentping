import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FilterBar } from "../../components/recipes/crud/filters/FilterBar";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof FilterBar> = {
  title: "Migrations/Canonical/Recipes/FilterBar",
  component: FilterBar,
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
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = { args: {} };
