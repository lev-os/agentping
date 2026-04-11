import type { Meta, StoryObj } from "@storybook/react-vite";
import { LeaseApproval } from "../../components/migrations/lease-approval";

const meta: Meta<typeof LeaseApproval> = {
  title: "Migrations/WebUI/LeaseApproval",
  component: LeaseApproval,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LeaseApproval>;

export const Default: Story = {
  args: {},
};
