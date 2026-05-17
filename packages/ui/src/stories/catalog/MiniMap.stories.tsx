import type { Meta, StoryObj } from "@storybook/react-vite";
import { MiniMap } from "../../components/catalog/mini-map";

const meta: Meta<typeof MiniMap> = {
  title: "Catalog/WebUI/MiniMap",
  component: MiniMap,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof MiniMap>;

export const Default: Story = {
  args: {
    viewportWidth: 800,
    viewportHeight: 600,
    contentWidth: 2400,
    contentHeight: 1600,
    scrollX: 200,
    scrollY: 100,
  },
};
