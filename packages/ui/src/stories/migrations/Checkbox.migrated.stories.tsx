// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../components/migrations/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Migrations/WebUI/Sofia/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};
