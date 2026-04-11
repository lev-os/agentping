import type { Meta, StoryObj } from "@storybook/react-vite";
import { TickerTape } from "../../components/migrations/ticker-tape";

const meta = {
  title: "Migrations/WebUI/Finance/TickerTape",
  component: TickerTape,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TickerTape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
