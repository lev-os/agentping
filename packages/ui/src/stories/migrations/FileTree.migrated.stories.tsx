import type { Meta, StoryObj } from "@storybook/react";
import { FileTree } from "../../components/migrations/file-tree";

const meta = {
  title: "Migrations/Studio/FileTree",
  component: FileTree,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ width: 260 }}><Story /></div>],
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { name: "src", path: "/src", type: "directory", children: [
        { name: "App.tsx", path: "/src/App.tsx", type: "file", extension: "tsx" },
        { name: "index.ts", path: "/src/index.ts", type: "file", extension: "ts" },
        { name: "components", path: "/src/components", type: "directory", children: [
          { name: "Button.tsx", path: "/src/components/Button.tsx", type: "file", extension: "tsx" },
        ]},
      ]},
      { name: "README.md", path: "/README.md", type: "file", extension: "md" },
      { name: "package.json", path: "/package.json", type: "file", extension: "json" },
    ],
    onFileClick: () => {},
    modifiedPaths: new Set(["/src/App.tsx"]),
    selectedPath: "/src/App.tsx",
  },
};
