import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoSidebar } from "../../components/catalog/info-sidebar";

const meta: Meta<typeof InfoSidebar> = {
  title: "Catalog/WebUI/InfoSidebar",
  component: InfoSidebar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof InfoSidebar>;

export const Default: Story = {
  args: {},
};
