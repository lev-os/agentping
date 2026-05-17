import type { Meta, StoryObj } from "@storybook/react-vite";
import { TickerTape } from "../../components/catalog/ticker-tape";

const meta = {
  title: "Catalog/WebUI/Finance/TickerTape",
  component: TickerTape,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TickerTape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
