import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalConsole } from "../../components/catalog/terminal-console";

const meta = {
  title: "Catalog/WebUI/System/TerminalConsole",
  component: TerminalConsole,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TerminalConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
