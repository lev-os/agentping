import type { Meta, StoryObj } from "@storybook/react";
import { CandleStickChart } from "../../components/migrations/candlestick-chart";

const meta = {
  title: "Migrations/WebUI/Finance/CandleStickChart",
  component: CandleStickChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CandleStickChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
