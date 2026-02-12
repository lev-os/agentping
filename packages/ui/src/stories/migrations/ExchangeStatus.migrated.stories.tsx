import type { Meta, StoryObj } from "@storybook/react";
import { ExchangeStatus } from "../../components/migrations/exchange-status";

const meta = {
  title: "Migrations/WebUI/Finance/ExchangeStatus",
  component: ExchangeStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ExchangeStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
