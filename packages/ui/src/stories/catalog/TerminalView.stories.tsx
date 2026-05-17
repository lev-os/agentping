import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalView } from "../../components/catalog/terminal-view";

const meta = {
  title: "Catalog/WebUI/Root/TerminalView",
  component: TerminalView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TerminalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lines: [
      { text: "lev init --template agent", type: "input" },
      { text: "Initializing project...", type: "system" },
      { text: "Created .lev/config.yaml", type: "output" },
      { text: "Created core/flowmind/", type: "output" },
      { text: "Warning: Node 18+ required", type: "error" },
      { text: "lev status", type: "input" },
      { text: "Branch: feat/memory-as-flowmind", type: "output" },
      { text: "Active flows: 3", type: "output" },
      { text: "System ready.", type: "system" },
    ],
    prompt: "$ ",
  },
};

export const ErrorState: Story = {
  args: {
    lines: [
      { text: "npm run build", type: "input" },
      { text: "Compiling TypeScript...", type: "system" },
      { text: "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.", type: "error" },
      { text: "error TS2304: Cannot find name 'fetchData'.", type: "error" },
      { text: "Build failed with 2 errors.", type: "error" },
    ],
    prompt: "~/project $ ",
  },
};
