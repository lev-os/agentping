// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderStatusDropdown } from "../../components/migrations/header-status-dropdown";

const meta: Meta<typeof HeaderStatusDropdown> = {
  title: "Migrations/WebUI/Recipes/HeaderStatusDropdown",
  component: HeaderStatusDropdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HeaderStatusDropdown>;

export const Default: Story = {
  args: {},
};
