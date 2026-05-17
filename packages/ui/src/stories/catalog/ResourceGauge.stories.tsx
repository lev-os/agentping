import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResourceGauge } from "../../components/catalog/resource-gauge";

const meta = {
  title: "Catalog/WebUI/Root/ResourceGauge",
  component: ResourceGauge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ResourceGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarLow: Story = { args: { value: 30, label: "CPU", variant: "bar" } };

export const BarHigh: Story = { args: { value: 92, label: "Memory", variant: "bar" } };

export const CircleGauge: Story = { args: { value: 65, label: "Disk", variant: "circle" } };
