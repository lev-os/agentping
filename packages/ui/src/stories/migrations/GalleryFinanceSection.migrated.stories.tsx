import type { Meta, StoryObj } from "@storybook/react";
import { GalleryFinanceSection } from "../../components/migrations/gallery-finance-section";

const meta = {
  title: "Migrations/WebUI/Gallery/GalleryFinanceSection",
  component: GalleryFinanceSection,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof GalleryFinanceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
