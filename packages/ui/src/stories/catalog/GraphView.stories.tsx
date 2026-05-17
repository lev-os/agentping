import type { Meta, StoryObj } from "@storybook/react-vite";
import { GraphView } from "../../components/catalog/graph-view";

const meta: Meta<typeof GraphView> = {
  title: "Catalog/WebUI/Dashboard/GraphView",
  component: GraphView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GraphView>;

export const Default: Story = {
  args: {},
};
