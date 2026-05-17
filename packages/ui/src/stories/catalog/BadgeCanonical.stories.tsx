import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "Catalog/Canonical/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Badge" } };
export const Success: Story = { args: { children: "Online", variant: "success" } };
