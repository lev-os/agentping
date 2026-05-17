import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexGridBackground } from "../../components/catalog/hex-grid-background";

const meta = {
  title: "Catalog/WebUI/Visuals/HexGridBackground",
  component: HexGridBackground,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof HexGridBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
