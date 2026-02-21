// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { FilteredDropdown } from "../../components/migrations/filtered-dropdown";

const meta: Meta<typeof FilteredDropdown> = {
  title: "Migrations/WebUI/Sofia/FilteredDropdown",
  component: FilteredDropdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FilteredDropdown>;

export const Default: Story = {
  args: {},
};
