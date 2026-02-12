import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalQueue } from "../../components/migrations/approval-queue";

const meta = {
  title: "Migrations/Studio/ApprovalQueue",
  component: ApprovalQueue,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ApprovalQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    approvals: [
      { id: "1", toolName: "Edit", description: "Modify src/App.tsx", timestamp: new Date(), input: { file_path: "/src/App.tsx" } },
      { id: "2", toolName: "Bash", description: "Run npm test", timestamp: new Date() },
    ],
    onApprove: () => {},
    onReject: () => {},
    onApproveAll: () => {},
    onRejectAll: () => {},
  },
};
