import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "../../components/migrations/color-picker";

const meta: Meta<typeof ColorPicker> = {
  title: "Migrations/WebUI/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {},
};
