import type { Meta, StoryObj } from "@storybook/react";
import { GallerySystemSection } from "../../components/migrations/gallery-system-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GallerySystemSection",
  component: GallerySystemSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySystemSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
