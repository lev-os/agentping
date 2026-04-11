import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryVisualsSection } from "../../components/migrations/gallery-visuals-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryVisualsSection",
  component: GalleryVisualsSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryVisualsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
