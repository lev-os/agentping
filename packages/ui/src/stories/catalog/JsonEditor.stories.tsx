import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonEditor } from "../../components/catalog/json-editor";

const meta: Meta<typeof JsonEditor> = {
  title: "Catalog/WebUI/JsonEditor",
  component: JsonEditor,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof JsonEditor>;

export const Default: Story = {
  args: {},
};
