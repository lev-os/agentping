import type { Meta, StoryObj } from "@storybook/react-vite";
import { GallerySystemSection } from "../../components/catalog/gallery-system-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GallerySystemSection",
  component: GallerySystemSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySystemSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
