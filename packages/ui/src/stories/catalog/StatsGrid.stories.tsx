import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatsGrid } from "../../components/catalog/stats-grid";

const meta = {
  title: "Catalog/WebUI/Root/StatsGrid",
  component: StatsGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
