import type { Meta, StoryObj } from "@storybook/react-vite";
import { TradeHistory } from "../../components/catalog/trade-history";

const meta = {
  title: "Catalog/WebUI/Finance/TradeHistory",
  component: TradeHistory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TradeHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
