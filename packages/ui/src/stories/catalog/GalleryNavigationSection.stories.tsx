import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryNavigationSection } from "../../components/catalog/gallery-navigation-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryNavigationSection",
  component: GalleryNavigationSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryNavigationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
