import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../components/migrations/switch";

const meta: Meta<typeof Switch> = {
  title: "Migrations/WebUI/Sofia/Switch",
  component: Switch,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};
