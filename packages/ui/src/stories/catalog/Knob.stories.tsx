import type { Meta, StoryObj } from "@storybook/react-vite";
import { Knob } from "../../components/catalog/knob";

const meta: Meta<typeof Knob> = {
  title: "Catalog/WebUI/Knob",
  component: Knob,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Knob>;

export const Default: Story = {
  args: {},
};
