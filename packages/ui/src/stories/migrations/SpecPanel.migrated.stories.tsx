import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpecPanel } from "../../components/migrations/spec-panel";

const meta: Meta<typeof SpecPanel> = {
  title: "Migrations/WebUI/Dashboard/SpecPanel",
  component: SpecPanel,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SpecPanel>;

export const Default: Story = {
  args: {},
};
