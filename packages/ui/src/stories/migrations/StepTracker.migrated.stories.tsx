import type { Meta, StoryObj } from "@storybook/react";
import { StepTracker } from "../../components/migrations/step-tracker";

const meta = {
  title: "Migrations/WebUI/Root/StepTracker",
  component: StepTracker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StepTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { label: "Initialize project", status: "completed" },
      { label: "Install dependencies", status: "completed" },
      { label: "Configure environment", status: "active" },
      { label: "Run migrations", status: "pending" },
      { label: "Deploy", status: "pending" },
    ],
  },
};

export const WithError: Story = {
  args: {
    steps: [
      { label: "Build", status: "completed" },
      { label: "Test", status: "error" },
      { label: "Deploy", status: "pending" },
    ],
  },
};
