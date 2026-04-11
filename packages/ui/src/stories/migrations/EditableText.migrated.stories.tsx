import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditableText } from "../../components/migrations/editable-text";

const meta: Meta<typeof EditableText> = {
  title: "Migrations/WebUI/EditableText",
  component: EditableText,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EditableText>;

export const Default: Story = {
  args: {},
};
