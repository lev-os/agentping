// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../../components/ui/input";

const meta: Meta<typeof Input> = {
  title: "Catalog/Canonical/UI/Input",
  component: Input,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Enter text..." } };
export const WithError: Story = { args: { placeholder: "Invalid input", error: true } };
