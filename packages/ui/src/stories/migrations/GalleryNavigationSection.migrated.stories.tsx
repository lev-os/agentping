import type { Meta, StoryObj } from "@storybook/react";
import { GalleryNavigationSection } from "../../components/migrations/gallery-navigation-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryNavigationSection",
  component: GalleryNavigationSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryNavigationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
