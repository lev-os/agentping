import type { Meta, StoryObj } from "@storybook/react";
import { PrimitivesGallery } from "../../components/migrations/primitives-gallery";

const meta = {
  title: "Migrations/WebUI/Root/PrimitivesGallery",
  component: PrimitivesGallery,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PrimitivesGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
