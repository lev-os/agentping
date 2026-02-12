import type { Meta, StoryObj } from "@storybook/react";
import { ForecastingLine } from "../../components/migrations/forecasting-line";

const meta = {
  title: "Migrations/WebUI/Finance/ForecastingLine",
  component: ForecastingLine,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ForecastingLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
