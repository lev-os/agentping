import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ListView } from "../../components/catalog/list-view";
import { CrudProvider } from "../../components/catalog/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof ListView> = {
  title: "Catalog/WebUI/Recipes/ListView",
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

export const Default: Story = {
  args: {},
};
