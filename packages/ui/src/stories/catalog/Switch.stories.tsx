// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../../components/catalog/switch";

const meta: Meta<typeof Switch> = {
  title: "Catalog/WebUI/Sofia/Switch",
  component: Switch,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};
