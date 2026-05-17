import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdvancedDataGrid } from "../../components/catalog/advanced-data-grid";

const meta = {
  title: "Catalog/WebUI/Data/AdvancedDataGrid",
  component: AdvancedDataGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AdvancedDataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
