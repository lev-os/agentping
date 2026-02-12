import type { Meta, StoryObj } from "@storybook/react";
import { AdvancedDataGrid } from "../../components/migrations/advanced-data-grid";

const meta = {
  title: "Migrations/WebUI/Data/AdvancedDataGrid",
  component: AdvancedDataGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AdvancedDataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
