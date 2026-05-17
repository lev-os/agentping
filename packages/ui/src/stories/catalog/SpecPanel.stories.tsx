import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpecPanel } from "../../components/catalog/spec-panel";

const meta: Meta<typeof SpecPanel> = {
  title: "Catalog/WebUI/Dashboard/SpecPanel",
  component: SpecPanel,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SpecPanel>;

export const Default: Story = {
  args: {},
};
