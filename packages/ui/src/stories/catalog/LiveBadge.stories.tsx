import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveBadge } from "../../components/catalog/live-badge";

const meta: Meta<typeof LiveBadge> = {
  title: "Catalog/WebUI/LiveBadge",
  component: LiveBadge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LiveBadge>;

export const Default: Story = {
  args: {},
};
