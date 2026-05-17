import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryContentSection } from "../../components/catalog/gallery-content-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryContentSection",
  component: GalleryContentSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
