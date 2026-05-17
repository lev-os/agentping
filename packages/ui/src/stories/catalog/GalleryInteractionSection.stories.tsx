import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryInteractionSection } from "../../components/catalog/gallery-interaction-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryInteractionSection",
  component: GalleryInteractionSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryInteractionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
