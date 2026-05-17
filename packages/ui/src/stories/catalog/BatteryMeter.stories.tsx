import type { Meta, StoryObj } from "@storybook/react-vite";
import { BatteryMeter } from "../../components/catalog/battery-meter";

const meta: Meta<typeof BatteryMeter> = {
  title: "Catalog/WebUI/BatteryMeter",
  component: BatteryMeter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof BatteryMeter>;

export const Default: Story = {
  args: { level: 75 },
};

export const Low: Story = {
  args: { level: 15, label: "Low" },
};

export const Charging: Story = {
  args: { level: 60, charging: true },
};
