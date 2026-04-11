import type { Meta, StoryObj } from "@storybook/react-vite";
import { GeoMap } from "../../components/migrations/geo-map";

const meta = {
  title: "Migrations/WebUI/Visuals/GeoMap",
  component: GeoMap,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GeoMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
