// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "../../components/ui/search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Migrations/Canonical/UI/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = { args: { placeholder: "Search..." } };
