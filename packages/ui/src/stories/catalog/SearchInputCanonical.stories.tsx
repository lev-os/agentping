// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "../../components/ui/search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Catalog/Canonical/UI/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = { args: { placeholder: "Search..." } };
