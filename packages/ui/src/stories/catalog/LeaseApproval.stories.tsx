import type { Meta, StoryObj } from "@storybook/react-vite";
import { LeaseApproval } from "../../components/catalog/lease-approval";

const meta: Meta<typeof LeaseApproval> = {
  title: "Catalog/WebUI/LeaseApproval",
  component: LeaseApproval,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LeaseApproval>;

export const Default: Story = {
  args: {},
};
