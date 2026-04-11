import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeExpander } from "../../components/migrations/tree-expander";

const meta: Meta<typeof TreeExpander> = {
  title: "Migrations/WebUI/Dashboard/TreeExpander",
  component: TreeExpander,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TreeExpander>;

export const Default: Story = {
  args: {},
};
