import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryMediaSection } from "../../components/catalog/gallery-media-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryMediaSection",
  component: GalleryMediaSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryMediaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
