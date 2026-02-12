import type { Meta, StoryObj } from "@storybook/react";
import { TreeBrowser } from "../../components/migrations/tree-browser";

const meta = {
  title: "Migrations/WebUI/Root/TreeBrowser",
  component: TreeBrowser,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TreeBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nodes: [
      {
        id: "1", label: "src", type: "folder", children: [
          { id: "2", label: "components", type: "folder", children: [
            { id: "3", label: "Button.tsx", type: "file" },
            { id: "4", label: "Input.tsx", type: "file" },
          ]},
          { id: "5", label: "utils", type: "folder", children: [
            { id: "6", label: "cn.ts", type: "file" },
          ]},
          { id: "7", label: "index.ts", type: "file" },
        ],
      },
      { id: "8", label: "package.json", type: "file" },
      { id: "9", label: "tsconfig.json", type: "file" },
    ],
  },
};

export const Empty: Story = {
  args: { nodes: [] },
};
