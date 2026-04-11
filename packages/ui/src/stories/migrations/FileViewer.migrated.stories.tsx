import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileViewer } from "../../components/migrations/file-viewer";

const meta = {
  title: "Migrations/Studio/FileViewer",
  component: FileViewer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 400 }}><Story /></div>],
} satisfies Meta<typeof FileViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filePath: "/src/components/Button.tsx",
    language: "typescript",
    content: `import React from "react";\n\nexport interface ButtonProps {\n  label: string;\n  onClick?: () => void;\n}\n\nexport function Button({ label, onClick }: ButtonProps) {\n  return <button onClick={onClick}>{label}</button>;\n}`,
    onClose: () => {},
    onCopy: () => {},
  },
};

export const Loading: Story = { args: { filePath: "/src/App.tsx", loading: true } };
export const WithError: Story = { args: { filePath: "/src/missing.ts", error: "File not found" } };
