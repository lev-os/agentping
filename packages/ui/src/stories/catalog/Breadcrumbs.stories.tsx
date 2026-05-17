import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "../../components/catalog/breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Catalog/WebUI/Breadcrumbs",
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
