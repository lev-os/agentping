import type { Meta, StoryObj } from "@storybook/react";
import { GalleryDataSection } from "../../components/migrations/gallery-data-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryDataSection",
  component: GalleryDataSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryDataSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
