import type { Meta, StoryObj } from "@storybook/react";
import { LoadingProgress } from "../../components/migrations/loading-progress";

const meta: Meta<typeof LoadingProgress> = {
  title: "Migrations/WebUI/LoadingProgress",
  component: LoadingProgress,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LoadingProgress>;

export const Default: Story = {
  args: {
    stages: [
      { id: "1", label: "Connecting", status: "complete" },
      { id: "2", label: "Authenticating", status: "complete" },
      { id: "3", label: "Loading data", status: "loading" },
      { id: "4", label: "Initializing UI", status: "pending" },
    ],
  },
};
