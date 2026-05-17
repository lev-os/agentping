import type { Meta, StoryObj } from "@storybook/react-vite";
import { SchemaGraph } from "../../components/catalog/schema-graph";

const meta = {
  title: "Catalog/WebUI/Data/SchemaGraph",
  component: SchemaGraph,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SchemaGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
