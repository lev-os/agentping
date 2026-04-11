import type { Meta, StoryObj } from "@storybook/react-vite";
import { EncryptionStatus } from "../../components/migrations/encryption-status";

const meta = {
  title: "Migrations/WebUI/System/EncryptionStatus",
  component: EncryptionStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EncryptionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
