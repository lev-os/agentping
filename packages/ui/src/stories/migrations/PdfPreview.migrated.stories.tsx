import type { Meta, StoryObj } from "@storybook/react-vite";
import { PdfPreview } from "../../components/migrations/pdf-preview";

const meta = {
  title: "Migrations/WebUI/Root/PdfPreview",
  component: PdfPreview,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
