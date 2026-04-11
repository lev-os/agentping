import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarField } from "../../components/migrations/star-field";

const meta = {
  title: "Migrations/WebUI/Visuals/StarField",
  component: StarField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StarField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
