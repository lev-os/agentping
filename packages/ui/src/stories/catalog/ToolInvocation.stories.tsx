import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolInvocation } from "../../components/catalog/tool-invocation";

const meta = {
  title: "Catalog/WebUI/Root/ToolInvocation",
  component: ToolInvocation,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToolInvocation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "search_codebase",
    args: { query: "useEffect cleanup", scope: "src/**/*.tsx" },
    status: "success",
    result: { matches: 12, files: ["App.tsx", "Dashboard.tsx"] },
    duration: 342,
  },
};

export const Running: Story = {
  args: {
    name: "build_project",
    args: { target: "production", minify: true },
    status: "running",
  },
};

export const Error: Story = {
  args: {
    name: "deploy",
    args: { env: "staging" },
    status: "error",
    result: "Error: Connection refused",
    duration: 5200,
  },
};
