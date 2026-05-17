import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryDataSection } from "../../components/catalog/gallery-data-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryDataSection",
  component: GalleryDataSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryDataSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
