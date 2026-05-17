import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusCard } from "../../components/catalog/status-card";

const meta = {
  title: "Catalog/WebUI/Root/StatusCard",
  component: StatusCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
