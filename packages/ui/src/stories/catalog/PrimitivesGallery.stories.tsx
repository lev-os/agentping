import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivesGallery } from "../../components/catalog/primitives-gallery";

const meta = {
  title: "Catalog/WebUI/Root/PrimitivesGallery",
  component: PrimitivesGallery,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PrimitivesGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
