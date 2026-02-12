import type { Meta, StoryObj } from "@storybook/react";
import { GallerySofiaSection } from "../../components/migrations/gallery-sofia-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GallerySofiaSection",
  component: GallerySofiaSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySofiaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
