import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryAISection } from "../../components/catalog/gallery-ai-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryAISection",
  component: GalleryAISection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryAISection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
