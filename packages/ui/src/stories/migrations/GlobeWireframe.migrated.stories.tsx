import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlobeWireframe } from "../../components/migrations/globe-wireframe";

const meta = {
  title: "Migrations/WebUI/Visuals/GlobeWireframe",
  component: GlobeWireframe,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GlobeWireframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
