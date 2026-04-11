import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "../../components/migrations/breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Migrations/WebUI/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    path: ["Home", "Agents", "Nova-7", "Settings"],
  },
};
