import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ViewSwitcher } from "../../components/recipes/crud/views/ViewSwitcher";
import { CrudProvider } from "../../components/migrations/crud-context";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof ViewSwitcher> = {
  title: "Migrations/Canonical/Recipes/ViewSwitcher",
  component: ViewSwitcher,
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
type Story = StoryObj<typeof ViewSwitcher>;

export const Default: Story = { args: {} };
