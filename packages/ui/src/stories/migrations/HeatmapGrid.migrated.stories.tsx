import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeatmapGrid } from "../../components/migrations/heatmap-grid";

const meta: Meta<typeof HeatmapGrid> = {
  title: "Migrations/WebUI/HeatmapGrid",
  component: HeatmapGrid,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HeatmapGrid>;

export const Default: Story = {
  args: {
    data: [
      [1, 3, 5, 2, 8],
      [4, 7, 2, 9, 1],
      [6, 1, 4, 3, 7],
      [2, 5, 8, 1, 4],
    ],
    labels: {
      rows: ["Mon", "Tue", "Wed", "Thu"],
      cols: ["00:00", "06:00", "12:00", "18:00", "23:00"],
    },
  },
};
