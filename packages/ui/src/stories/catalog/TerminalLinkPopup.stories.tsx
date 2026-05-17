import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalLinkPopup } from "../../components/catalog/terminal-link-popup";

const meta = {
  title: "Catalog/Studio/TerminalLinkPopup",
  component: TerminalLinkPopup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TerminalLinkPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "http://localhost:3000",
    position: { x: 200, y: 200 },
    onOpenExternal: () => {},
    onOpenPreview: () => {},
    onClose: () => {},
  },
};
