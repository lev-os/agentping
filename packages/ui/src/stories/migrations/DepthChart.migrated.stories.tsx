import type { Meta, StoryObj } from "@storybook/react-vite";
import { DepthChart } from "../../components/migrations/depth-chart";

const meta = {
  title: "Migrations/WebUI/Finance/DepthChart",
  component: DepthChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DepthChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "BTC/USD Depth",
    bids: [
      { price: 64200, amount: 1.5, total: 1.5 },
      { price: 64100, amount: 2.3, total: 3.8 },
      { price: 64000, amount: 4.1, total: 7.9 },
    ],
    asks: [
      { price: 64300, amount: 1.2, total: 1.2 },
      { price: 64400, amount: 3.0, total: 4.2 },
      { price: 64500, amount: 5.5, total: 9.7 },
    ],
  },
};
