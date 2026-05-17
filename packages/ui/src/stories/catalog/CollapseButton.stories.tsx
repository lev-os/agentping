import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapseButton } from "../../components/catalog/collapse-button";

const meta: Meta<typeof CollapseButton> = {
  title: "Catalog/WebUI/Dashboard/CollapseButton",
  component: CollapseButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CollapseButton>;

export const Default: Story = {
  args: {},
};
