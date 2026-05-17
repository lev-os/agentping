import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryFeedbackSection } from "../../components/catalog/gallery-feedback-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryFeedbackSection",
  component: GalleryFeedbackSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryFeedbackSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
