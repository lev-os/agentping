import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryFinanceSection } from "../../components/catalog/gallery-finance-section";

const meta = {
  title: "Catalog/WebUI/Gallery/GalleryFinanceSection",
  component: GalleryFinanceSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryFinanceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
