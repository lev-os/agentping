import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentGallery } from "../../components/migrations/component-gallery";

const meta = {
  title: "Migrations/Studio/ComponentGallery",
  component: ComponentGallery,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 500, width: 280 }}><Story /></div>],
} satisfies Meta<typeof ComponentGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onAddComponent: () => {} } };
