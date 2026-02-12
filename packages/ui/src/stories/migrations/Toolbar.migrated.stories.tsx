import type { Meta, StoryObj } from "@storybook/react";
import { Toolbar } from "../../components/migrations/toolbar";

const meta = {
  title: "Migrations/Studio/Toolbar",
  component: Toolbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTool: "select",
    layoutMode: "design",
    fileName: "Dashboard.apen",
    zoom: 100,
    onToolChange: () => {},
    onSave: () => {},
    onOpen: () => {},
    onToggleSidebar: () => {},
    onLayoutModeChange: () => {},
    onToggleTerminal: () => {},
    onUndo: () => {},
    onRedo: () => {},
    canUndo: true,
    canRedo: false,
    onZoomIn: () => {},
    onZoomOut: () => {},
    onZoomReset: () => {},
    onCommandPalette: () => {},
    onToggleTheme: () => {},
  },
};

export const UnsavedChanges: Story = {
  args: {
    ...Default.args,
    hasUnsavedChanges: true,
  },
};
