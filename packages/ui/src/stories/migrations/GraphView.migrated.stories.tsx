import type { Meta, StoryObj } from "@storybook/react";
import { GraphView } from "../../components/migrations/graph-view";

const meta: Meta<typeof GraphView> = {
  title: "Migrations/WebUI/Dashboard/GraphView",
  component: GraphView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GraphView>;

export const Default: Story = {
  args: {},
};
