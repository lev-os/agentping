import type { Meta, StoryObj } from "@storybook/react";
import { AuditLogViewer } from "../../components/migrations/audit-log-viewer";

const meta: Meta<typeof AuditLogViewer> = {
  title: "Migrations/WebUI/AuditLogViewer",
  component: AuditLogViewer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AuditLogViewer>;

export const Default: Story = {
  args: {
    logs: [
      { id: "1", timestamp: "2025-01-15 14:32", actor: "admin@kingly.ai", action: "updated", resource: "agent/nova-7" },
      { id: "2", timestamp: "2025-01-15 14:30", actor: "system", action: "deployed", resource: "service/gateway" },
      { id: "3", timestamp: "2025-01-15 14:28", actor: "jsmith", action: "created", resource: "workflow/etl-pipeline" },
    ],
  },
};
