import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "../../components/migrations/tag-input";

const meta = {
  title: "Migrations/WebUI/Root/TagInput",
  component: TagInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tags: ["react", "typescript", "tailwind"],
    placeholder: "Add tag...",
  },
};

export const Empty: Story = {
  args: { tags: [], placeholder: "Type and press Enter" },
};

export const MaxReached: Story = {
  args: { tags: ["a", "b", "c"], maxTags: 3 },
};
