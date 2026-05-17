import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorCluster } from "../../components/catalog/error-cluster";

const meta: Meta<typeof ErrorCluster> = {
  title: "Catalog/WebUI/ErrorCluster",
  component: ErrorCluster,
  tags: ["autodocs"],
  argTypes: {
    errors: { control: "object" },
    className: { control: "text" },
  },
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
