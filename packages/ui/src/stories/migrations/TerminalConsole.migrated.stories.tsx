import type { Meta, StoryObj } from "@storybook/react";
import { TerminalConsole } from "../../components/migrations/terminal-console";

const meta = {
  title: "Migrations/WebUI/System/TerminalConsole",
  component: TerminalConsole,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TerminalConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
