// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilteredDropdown } from "../../components/catalog/filtered-dropdown";

const meta: Meta<typeof FilteredDropdown> = {
  title: "Catalog/WebUI/Sofia/FilteredDropdown",
  component: FilteredDropdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FilteredDropdown>;

export const Default: Story = {
  args: {},
};
