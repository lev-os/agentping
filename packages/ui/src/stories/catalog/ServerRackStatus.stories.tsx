import type { Meta, StoryObj } from "@storybook/react-vite";
import { ServerRackStatus } from "../../components/catalog/server-rack-status";

const meta = {
  title: "Catalog/WebUI/System/ServerRackStatus",
  component: ServerRackStatus,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ServerRackStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
