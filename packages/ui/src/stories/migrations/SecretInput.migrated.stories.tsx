import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecretInput } from "../../components/migrations/secret-input";

const meta = {
  title: "Migrations/WebUI/Root/SecretInput",
  component: SecretInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SecretInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "API Key", placeholder: "sk-..." },
};

export const WithValue: Story = {
  args: { label: "Password", value: "supersecret123" },
};
