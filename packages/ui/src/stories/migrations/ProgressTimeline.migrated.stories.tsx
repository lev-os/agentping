import type { Meta, StoryObj } from "@storybook/react";
import { ProgressTimeline } from "../../components/migrations/progress-timeline";

const meta = {
  title: "Migrations/WebUI/Root/ProgressTimeline",
  component: ProgressTimeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { id: "1", label: "Build", status: "completed", description: "Compiled successfully" },
      { id: "2", label: "Test", status: "completed", description: "42 tests passed" },
      { id: "3", label: "Deploy", status: "active", description: "Deploying to staging..." },
      { id: "4", label: "Verify", status: "pending" },
    ],
  },
};
