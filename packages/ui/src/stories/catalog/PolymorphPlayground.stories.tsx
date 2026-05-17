import type { Meta, StoryObj } from "@storybook/react-vite";
import { PolymorphPlayground } from "../../components/catalog/polymorph-playground";

const meta = {
  title: "Catalog/Canvas/PolymorphPlayground",
  component: PolymorphPlayground,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PolymorphPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
