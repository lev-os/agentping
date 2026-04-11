import type { Meta, StoryObj } from "@storybook/react-vite";
import { KanbanBoard } from "../../components/migrations/kanban-board";

const meta: Meta<typeof KanbanBoard> = {
  title: "Migrations/WebUI/KanbanBoard",
  component: KanbanBoard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: {
    columns: [
      { id: "todo", title: "To Do", items: [{ id: "1", title: "Review PR #42", description: "Code review pending" }] },
      { id: "in-progress", title: "In Progress", items: [{ id: "2", title: "Fix auth bug" }, { id: "3", title: "Update docs" }] },
      { id: "done", title: "Done", items: [{ id: "4", title: "Deploy v2.0" }] },
    ],
  },
};
