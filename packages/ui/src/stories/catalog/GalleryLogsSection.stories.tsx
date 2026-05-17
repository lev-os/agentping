import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryLogsSection } from "../../components/catalog/gallery-logs-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryLogsSection",
  component: GalleryLogsSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryLogsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
