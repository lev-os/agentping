import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "../../components/migrations/text-area";

const meta = {
  title: "Migrations/WebUI/Root/TextArea",
  component: TextArea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    rows: 4,
  },
};

export const WithMaxLength: Story = {
  args: {
    label: "Bio",
    value: "Full-stack developer passionate about TypeScript.",
    maxLength: 200,
    rows: 3,
  },
};

export const Disabled: Story = {
  args: {
    label: "Read Only",
    value: "This field is disabled.",
    disabled: true,
  },
};
