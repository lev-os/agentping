import type { Meta, StoryObj } from "@storybook/react";
import { TodoList } from "../../components/migrations/todo-list";

const meta = {
  title: "Migrations/Canvas/TodoList",
  component: TodoList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Sprint Tasks",
    items: [
      { id: "1", text: "Review PR #42", checked: true, priority: "P0" },
      { id: "2", text: "Deploy staging", checked: false, priority: "P1" },
      { id: "3", text: "Write tests", checked: false },
    ],
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data),
  },
};

export const Empty: Story = {
  args: { title: "Empty List", items: [], onRespond: () => {} },
};
