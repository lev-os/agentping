import type { Meta, StoryObj } from "@storybook/react-vite";
import { MindMap } from "../../components/catalog/mind-map";

const meta: Meta<typeof MindMap> = {
  title: "Catalog/WebUI/MindMap",
  component: MindMap,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MindMap>;

export const Default: Story = {
  args: {
    data: {
      id: "root",
      label: "Agent System",
      children: [
        { id: "a", label: "Perception", children: [{ id: "a1", label: "Vision" }, { id: "a2", label: "Audio" }] },
        { id: "b", label: "Reasoning", children: [{ id: "b1", label: "Planning" }] },
        { id: "c", label: "Action" },
      ],
    },
  },
};
