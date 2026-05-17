import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldRenderer } from "../../components/catalog/field-renderer";

const meta: Meta<typeof FieldRenderer> = {
  title: "Catalog/WebUI/Recipes/FieldRenderer",
  component: FieldRenderer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FieldRenderer>;

export const Default: Story = {
  args: {
    field: { key: "name", label: "Name", type: "text" },
    value: "Agent Alpha",
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: { key: "email", label: "Email", type: "text", required: true },
    value: "",
    onChange: () => {},
    error: "Email is required",
  },
};
