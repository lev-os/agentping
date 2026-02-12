import type { Meta, StoryObj } from "@storybook/react";
import { AuditFeed } from "../../components/migrations/audit-feed";

const now = Date.now();
const meta = {
  title: "Migrations/Studio/AuditFeed",
  component: AuditFeed,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 400 }}><Story /></div>],
} satisfies Meta<typeof AuditFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: [
      { id: "1", type: "tool_use", title: "Read file: src/App.tsx", timestamp: new Date(now - 60000) },
      { id: "2", type: "message", title: "User sent message", timestamp: new Date(now - 45000) },
      { id: "3", type: "approval", title: "Edit approved", timestamp: new Date(now - 30000) },
      { id: "4", type: "error", title: "Build failed", description: "TypeScript error in line 42", timestamp: new Date(now - 15000), severity: "error" },
      { id: "5", type: "file_change", title: "Modified: src/App.tsx", timestamp: new Date(now - 5000) },
      { id: "6", type: "system", title: "Agent session started", timestamp: new Date(now) },
    ],
  },
};

export const Empty: Story = { args: { events: [] } };
