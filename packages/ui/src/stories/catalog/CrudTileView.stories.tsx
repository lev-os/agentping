import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TileView } from "../../components/recipes/crud/views/TileView";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof TileView> = {
  title: "Catalog/Canonical/Recipes/TileView",
  component: TileView,
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
type Story = StoryObj<typeof TileView>;

export const Default: Story = { args: {} };
