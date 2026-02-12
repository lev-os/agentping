import type { Meta, StoryObj } from "@storybook/react";
import { YearHeatmap } from "../../components/migrations/year-heatmap";

const meta = {
  title: "Migrations/WebUI/Root/YearHeatmap",
  component: YearHeatmap,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof YearHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

function generateData(year: number) {
  const data: { date: string; value: number }[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const iso = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay();
    const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
    data.push({ date: iso, value: isWeekday ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 3) });
    d.setDate(d.getDate() + 1);
  }
  return data;
}

export const Default: Story = {
  args: {
    data: generateData(2025),
    year: 2025,
  },
};

export const CustomColors: Story = {
  args: {
    data: generateData(2024),
    year: 2024,
    colorScale: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"],
  },
};
