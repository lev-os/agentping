import type { Meta, StoryObj } from "@storybook/react";
import { TradeHistory } from "../../components/migrations/trade-history";

const meta = {
  title: "Migrations/WebUI/Finance/TradeHistory",
  component: TradeHistory,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TradeHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
