import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskWorkflow } from "../../components/migrations/task-workflow";

const meta = {
  title: "Migrations/WebUI/Root/TaskWorkflow",
  component: TaskWorkflow,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskWorkflow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stages: [
      {
        id: "plan",
        label: "Planning",
        status: "completed",
        tasks: [
          { title: "Define requirements", done: true },
          { title: "Create wireframes", done: true },
          { title: "Review with team", done: true },
        ],
      },
      {
        id: "dev",
        label: "Development",
        status: "active",
        tasks: [
          { title: "Set up project", done: true },
          { title: "Implement API", done: true },
          { title: "Build UI components", done: false },
          { title: "Write tests", done: false },
        ],
      },
      {
        id: "qa",
        label: "QA Testing",
        status: "pending",
        tasks: [
          { title: "Unit tests", done: false },
          { title: "Integration tests", done: false },
          { title: "UAT sign-off", done: false },
        ],
      },
      {
        id: "deploy",
        label: "Deployment",
        status: "pending",
        tasks: [
          { title: "Stage deploy", done: false },
          { title: "Production deploy", done: false },
        ],
      },
    ],
  },
};

export const WithFailure: Story = {
  args: {
    stages: [
      {
        id: "build",
        label: "Build",
        status: "completed",
        tasks: [{ title: "Compile", done: true }, { title: "Bundle", done: true }],
      },
      {
        id: "test",
        label: "Test",
        status: "failed",
        tasks: [{ title: "Unit tests", done: true }, { title: "E2E tests", done: false }],
      },
      {
        id: "ship",
        label: "Ship",
        status: "pending",
        tasks: [{ title: "Deploy", done: false }],
      },
    ],
  },
};
