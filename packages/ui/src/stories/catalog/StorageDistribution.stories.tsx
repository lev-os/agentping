import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorageDistribution } from "../../components/catalog/storage-distribution";

const meta = {
  title: "Catalog/WebUI/Root/StorageDistribution",
  component: StorageDistribution,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StorageDistribution>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    segments: [
      { label: "Documents", value: 45, color: "#06b6d4" },
      { label: "Media", value: 30, color: "#8b5cf6" },
      { label: "Code", value: 15, color: "#22c55e" },
      { label: "Other", value: 10, color: "#eab308" },
    ],
  },
};
