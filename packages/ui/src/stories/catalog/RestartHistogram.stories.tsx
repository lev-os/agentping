import type { Meta, StoryObj } from "@storybook/react-vite";
import { RestartHistogram, type RestartDayData } from "../../components/catalog/restart-histogram";

const demoData: RestartDayData[] = [
  { date: "Feb 6", crashes: 2, manualRestarts: 1, healthFailures: 0, total: 3 },
  { date: "Feb 7", crashes: 0, manualRestarts: 0, healthFailures: 1, total: 1 },
  { date: "Feb 8", crashes: 1, manualRestarts: 2, healthFailures: 1, total: 4 },
  { date: "Feb 9", crashes: 0, manualRestarts: 0, healthFailures: 0, total: 0 },
  { date: "Feb 10", crashes: 3, manualRestarts: 0, healthFailures: 2, total: 5 },
  { date: "Feb 11", crashes: 0, manualRestarts: 1, healthFailures: 0, total: 1 },
  { date: "Feb 12", crashes: 1, manualRestarts: 0, healthFailures: 0, total: 1 },
];

const meta = {
  title: "Catalog/Studio/RestartHistogram",
  component: RestartHistogram,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof RestartHistogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { data: demoData, height: 300 } };
export const NoData: Story = { args: { data: [], height: 200 } };
