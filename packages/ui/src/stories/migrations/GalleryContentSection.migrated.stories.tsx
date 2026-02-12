import type { Meta, StoryObj } from "@storybook/react";
import { GalleryContentSection } from "../../components/migrations/gallery-content-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryContentSection",
  component: GalleryContentSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
