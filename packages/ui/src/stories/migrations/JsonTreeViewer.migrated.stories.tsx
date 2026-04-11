import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonTreeViewer } from "../../components/migrations/json-tree-viewer";

const meta = {
  title: "Migrations/WebUI/Data/JsonTreeViewer",
  component: JsonTreeViewer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof JsonTreeViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Agent Config",
    data: {
      name: "agent-1",
      version: "2.0.0",
      config: { retries: 3, timeout: 5000, verbose: true },
      tags: ["production", "us-west"],
    },
  },
};
