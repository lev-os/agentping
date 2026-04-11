// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "../../components/migrations/hero";

const meta: Meta<typeof Hero> = {
  title: "Migrations/WebUI/Recipes/Hero",
  component: Hero,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {},
};
