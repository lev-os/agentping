import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarSweep } from "../../components/catalog/radar-sweep";

const meta = {
  title: "Catalog/WebUI/Visuals/RadarSweep",
  component: RadarSweep,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadarSweep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
