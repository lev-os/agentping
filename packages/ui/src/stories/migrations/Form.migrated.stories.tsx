// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "../../components/migrations/form";

const meta: Meta<typeof FormField> = {
  title: "Migrations/WebUI/Sofia/Form",
  component: FormField,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    name: "example",
    render: () => null,
  },
};
