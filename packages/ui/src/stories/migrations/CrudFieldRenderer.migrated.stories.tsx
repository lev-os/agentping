import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldRenderer } from "../../components/recipes/crud/forms/FieldRenderer";

const meta: Meta<typeof FieldRenderer> = {
  title: "Migrations/Canonical/Recipes/FieldRenderer",
  component: FieldRenderer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FieldRenderer>;

export const Text: Story = {
  args: {
    field: { key: "name", label: "Name", type: "text", required: true },
    value: "Agent Alpha",
    onChange: () => {},
  },
};

export const Select: Story = {
  args: {
    field: {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Idle", value: "idle" },
        { label: "Error", value: "error" },
      ],
    },
    value: "active",
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: { key: "name", label: "Name", type: "text", required: true },
    value: "",
    onChange: () => {},
    error: "Name is required",
  },
};
