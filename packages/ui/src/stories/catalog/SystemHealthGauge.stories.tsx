import type { Meta, StoryObj } from "@storybook/react-vite";
import { SystemHealthGauge } from "../../components/catalog/system-health-gauge";

const meta = {
  title: "Catalog/WebUI/System/SystemHealthGauge",
  component: SystemHealthGauge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SystemHealthGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
