import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FilterBar } from "../../components/catalog/filter-bar";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof FilterBar> = {
  title: "Catalog/WebUI/Recipes/FilterBar",
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

export const Default: Story = {
  args: {},
};
