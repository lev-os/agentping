import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatsGrid } from "../../components/migrations/stats-grid";

const meta = {
  title: "Migrations/WebUI/Root/StatsGrid",
  component: StatsGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
