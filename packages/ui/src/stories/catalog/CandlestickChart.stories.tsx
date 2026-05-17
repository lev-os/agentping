import type { Meta, StoryObj } from "@storybook/react-vite";
import { CandleStickChart } from "../../components/catalog/candlestick-chart";

const meta = {
  title: "Catalog/WebUI/Finance/CandleStickChart",
  component: CandleStickChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CandleStickChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
