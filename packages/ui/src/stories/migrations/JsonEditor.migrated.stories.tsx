import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonEditor } from "../../components/migrations/json-editor";

const meta: Meta<typeof JsonEditor> = {
  title: "Migrations/WebUI/JsonEditor",
  component: JsonEditor,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof JsonEditor>;

export const Default: Story = {
  args: {},
};
