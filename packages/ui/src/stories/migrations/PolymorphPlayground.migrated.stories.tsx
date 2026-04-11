import type { Meta, StoryObj } from "@storybook/react-vite";
import { PolymorphPlayground } from "../../components/migrations/polymorph-playground";

const meta = {
  title: "Migrations/Canvas/PolymorphPlayground",
  component: PolymorphPlayground,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PolymorphPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
