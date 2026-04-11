import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileExplorer } from "../../components/migrations/file-explorer";

const meta = {
  title: "Migrations/Studio/FileExplorer",
  component: FileExplorer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 500, width: 280 }}><Story /></div>],
} satisfies Meta<typeof FileExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    files: [
      { name: "src", path: "/src", type: "directory", children: [
        { name: "App.tsx", path: "/src/App.tsx", type: "file", extension: "tsx" },
        { name: "main.ts", path: "/src/main.ts", type: "file", extension: "ts" },
      ]},
      { name: "package.json", path: "/package.json", type: "file", extension: "json" },
    ],
    workspacePath: "/Users/dev/myproject",
    onFileSelect: () => {},
    onRefresh: () => {},
  },
};

export const Empty: Story = { args: { files: [] } };
