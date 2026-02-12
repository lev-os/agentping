import type { Meta, StoryObj } from "@storybook/react";
import { GalleryLogsSection } from "../../components/migrations/gallery-logs-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryLogsSection",
  component: GalleryLogsSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryLogsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
