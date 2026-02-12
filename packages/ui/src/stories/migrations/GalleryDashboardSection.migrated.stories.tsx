import type { Meta, StoryObj } from "@storybook/react";
import { GalleryDashboardSection } from "../../components/migrations/gallery-dashboard-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryDashboardSection",
  component: GalleryDashboardSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryDashboardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
