import type { Meta, StoryObj } from "@storybook/react-vite";
import { CsvPreview } from "../../components/catalog/csv-preview";

const meta = {
  title: "Catalog/WebUI/Data/CsvPreview",
  component: CsvPreview,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CsvPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
