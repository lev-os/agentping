// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "../../components/catalog/status-dot";

const meta: Meta<typeof StatusDot> = {
  title: "Catalog/WebUI/Sofia/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: {},
};
