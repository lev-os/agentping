import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverlayFooter } from "../../components/migrations/overlay-footer";

const meta: Meta<typeof OverlayFooter> = {
  title: "Migrations/WebUI/Sofia/OverlayFooter",
  component: OverlayFooter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OverlayFooter>;

export const Default: Story = {
  args: {},
};
