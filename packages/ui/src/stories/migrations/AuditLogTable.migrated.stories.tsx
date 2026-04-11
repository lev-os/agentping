import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuditLogTable } from "../../components/migrations/audit-log-table";

const meta = {
  title: "Migrations/WebUI/Logs/AuditLogTable",
  component: AuditLogTable,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AuditLogTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
