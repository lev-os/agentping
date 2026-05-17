import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryDashboardSection } from "../../components/catalog/gallery-dashboard-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryDashboardSection",
  component: GalleryDashboardSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryDashboardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
