import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExchangeStatus } from "../../components/catalog/exchange-status";

const meta = {
  title: "Catalog/WebUI/Finance/ExchangeStatus",
  component: ExchangeStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ExchangeStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
