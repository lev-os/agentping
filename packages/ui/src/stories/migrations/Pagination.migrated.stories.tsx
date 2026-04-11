import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "../../components/migrations/pagination";

const meta = {
  title: "Migrations/WebUI/Root/Pagination",
  component: Pagination,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
