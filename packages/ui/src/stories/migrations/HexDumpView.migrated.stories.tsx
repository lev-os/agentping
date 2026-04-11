import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexDumpView } from "../../components/migrations/hex-dump-view";

const meta = {
  title: "Migrations/WebUI/Data/HexDumpView",
  component: HexDumpView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof HexDumpView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
