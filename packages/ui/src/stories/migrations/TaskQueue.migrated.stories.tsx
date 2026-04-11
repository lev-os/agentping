import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskQueue } from "../../components/migrations/task-queue";

const meta = {
  title: "Migrations/WebUI/Root/TaskQueue",
  component: TaskQueue,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tasks: [
      { id: "1", title: "Migrate database schema", status: "done", priority: 9 },
      { id: "2", title: "Update API endpoints", status: "running", priority: 7 },
      { id: "3", title: "Write integration tests", status: "queued", priority: 5 },
      { id: "4", title: "Deploy to staging", status: "queued", priority: 3 },
      { id: "5", title: "Seed test data", status: "failed", priority: 6 },
    ],
  },
};

export const Empty: Story = {
  args: { tasks: [] },
};
