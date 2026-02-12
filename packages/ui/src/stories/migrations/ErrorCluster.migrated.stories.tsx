import type { Meta, StoryObj } from "@storybook/react";
import { ErrorCluster } from "../../components/migrations/error-cluster";

const meta: Meta<typeof ErrorCluster> = {
  title: "Migrations/WebUI/ErrorCluster",
  component: ErrorCluster,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ErrorCluster>;

export const Default: Story = {
  args: {
    errors: [
      { id: "1", message: "TypeError: Cannot read property 'map' of undefined", count: 12, lastSeen: "2m ago" },
      { id: "2", message: "ReferenceError: ws is not defined", count: 3, lastSeen: "15m ago" },
    ],
  },
};
