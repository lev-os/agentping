import type { Meta, StoryObj } from "@storybook/react-vite";
import { DraggableList } from "../../components/migrations/draggable-list";

const meta: Meta<typeof DraggableList> = {
  title: "Migrations/WebUI/DraggableList",
  component: DraggableList,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DraggableList>;

export const Default: Story = {
  args: {
    items: [
      { id: "1", content: "First item" },
      { id: "2", content: "Second item" },
      { id: "3", content: "Third item" },
    ],
  },
};
