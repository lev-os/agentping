import type { Meta, StoryObj } from "@storybook/react-vite";
import { OverlayFooter } from "../../components/catalog/overlay-footer";

const meta: Meta<typeof OverlayFooter> = {
  title: "Catalog/WebUI/Sofia/OverlayFooter",
  component: OverlayFooter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OverlayFooter>;

export const Default: Story = {
  args: {},
};
