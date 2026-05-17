import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuildStatusLogs } from "../../components/catalog/build-status-logs";

const meta = {
  title: "Catalog/WebUI/Logs/BuildStatusLogs",
  component: BuildStatusLogs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof BuildStatusLogs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buildId: "b-2741",
    steps: [
      { id: "1", name: "Install dependencies", status: "success", duration: "12s" },
      { id: "2", name: "Type check", status: "success", duration: "8s" },
      { id: "3", name: "Build UI package", status: "running" },
      { id: "4", name: "Run tests", status: "pending" },
      { id: "5", name: "Deploy", status: "pending" },
    ],
  },
};
