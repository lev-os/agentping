import type { Meta, StoryObj } from "@storybook/react-vite";
import { EncryptionStatus } from "../../components/catalog/encryption-status";

const meta = {
  title: "Catalog/WebUI/System/EncryptionStatus",
  component: EncryptionStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EncryptionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
