import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexGridBackground } from "../../components/migrations/hex-grid-background";

const meta = {
  title: "Migrations/WebUI/Visuals/HexGridBackground",
  component: HexGridBackground,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof HexGridBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
