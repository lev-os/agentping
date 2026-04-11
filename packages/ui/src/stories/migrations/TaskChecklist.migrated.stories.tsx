import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskChecklist } from "../../components/migrations/task-checklist";

const meta = {
  title: "Migrations/Studio/TaskChecklist",
  component: TaskChecklist,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { id: "1", title: "Read component source", status: "complete", agent: "Claude" },
      { id: "2", title: "Create migration candidate", status: "complete", agent: "Claude" },
      { id: "3", title: "Create Storybook story", status: "in_progress", agent: "Claude" },
      { id: "4", title: "Review migration", status: "waiting_approval", description: "Needs human review before merging" },
      { id: "5", title: "Update barrel exports", status: "pending" },
    ],
    onApproveStep: () => {},
    onRejectStep: () => {},
  },
};
