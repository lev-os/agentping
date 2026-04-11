import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineTutorialTooltip } from "../../components/migrations/inline-tutorial-tooltip";

const meta: Meta<typeof InlineTutorialTooltip> = {
  title: "Migrations/WebUI/InlineTutorialTooltip",
  component: InlineTutorialTooltip,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof InlineTutorialTooltip>;

export const Default: Story = {
  args: {},
};
