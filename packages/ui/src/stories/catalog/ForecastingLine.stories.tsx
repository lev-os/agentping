import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForecastingLine } from "../../components/catalog/forecasting-line";

const meta = {
  title: "Catalog/WebUI/Finance/ForecastingLine",
  component: ForecastingLine,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ForecastingLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
