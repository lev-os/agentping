import type { Meta, StoryObj } from "@storybook/react-vite";
import { GallerySofiaSection } from "../../components/catalog/gallery-sofia-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GallerySofiaSection",
  component: GallerySofiaSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySofiaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
