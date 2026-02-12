import type { Meta, StoryObj } from "@storybook/react";
import { GallerySchedulingSection } from "../../components/migrations/gallery-scheduling-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GallerySchedulingSection",
  component: GallerySchedulingSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySchedulingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
