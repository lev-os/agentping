import type { Meta, StoryObj } from "@storybook/react";
import { GalleryInteractionSection } from "../../components/migrations/gallery-interaction-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryInteractionSection",
  component: GalleryInteractionSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryInteractionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
