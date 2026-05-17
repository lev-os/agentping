import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataPipeline } from "../../components/catalog/data-pipeline";

const meta = {
  title: "Catalog/WebUI/Data/DataPipeline",
  component: DataPipeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DataPipeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "ETL Pipeline",
    stages: [
      { id: "ingest", name: "Ingest", status: "success", throughput: "1.2k/s" },
      { id: "transform", name: "Transform", status: "running", throughput: "800/s" },
      { id: "validate", name: "Validate", status: "idle" },
      { id: "load", name: "Load", status: "idle" },
    ],
  },
};
