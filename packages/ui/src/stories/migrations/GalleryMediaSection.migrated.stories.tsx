import type { Meta, StoryObj } from "@storybook/react";
import { GalleryMediaSection } from "../../components/migrations/gallery-media-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryMediaSection",
  component: GalleryMediaSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryMediaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
