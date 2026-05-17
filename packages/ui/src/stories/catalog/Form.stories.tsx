// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "../../components/catalog/form";

const meta: Meta<typeof FormField> = {
  title: "Catalog/WebUI/Sofia/Form",
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
