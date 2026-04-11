import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryFormsSection } from "../../components/migrations/gallery-forms-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryFormsSection",
  component: GalleryFormsSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryFormsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
