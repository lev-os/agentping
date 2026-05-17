import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeExpander } from "../../components/catalog/tree-expander";

const meta: Meta<typeof TreeExpander> = {
  title: "Catalog/WebUI/Dashboard/TreeExpander",
  component: TreeExpander,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TreeExpander>;

export const Default: Story = {
  args: {},
};
