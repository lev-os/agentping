import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrderBook } from "../../components/migrations/order-book";

const meta = {
  title: "Migrations/WebUI/Finance/OrderBook",
  component: OrderBook,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof OrderBook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
