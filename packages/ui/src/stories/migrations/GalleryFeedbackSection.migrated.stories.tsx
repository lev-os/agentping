import type { Meta, StoryObj } from "@storybook/react";
import { GalleryFeedbackSection } from "../../components/migrations/gallery-feedback-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryFeedbackSection",
  component: GalleryFeedbackSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryFeedbackSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
