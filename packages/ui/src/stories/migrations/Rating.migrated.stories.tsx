import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "../../components/migrations/rating";

const meta = {
  title: "Migrations/WebUI/Root/Rating",
  component: Rating,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
