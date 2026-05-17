import type { Meta, StoryObj } from "@storybook/react-vite";
import { DependencyGraph } from "../../components/catalog/dependency-graph";

const meta: Meta<typeof DependencyGraph> = {
  title: "Catalog/WebUI/DependencyGraph",
  component: DependencyGraph,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DependencyGraph>;

export const Default: Story = {
  args: {
    nodes: [
      { id: "core", label: "core", deps: [], status: "ok" },
      { id: "ui", label: "ui", deps: ["core"], status: "ok" },
      { id: "daemon", label: "daemon", deps: ["core"], status: "warning" },
      { id: "studio", label: "studio", deps: ["ui", "daemon"], status: "ok" },
    ],
  },
};
