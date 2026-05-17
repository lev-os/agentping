import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarketHeatmap } from "../../components/catalog/market-heatmap";

const meta = {
  title: "Catalog/WebUI/Finance/MarketHeatmap",
  component: MarketHeatmap,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof MarketHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
