import type { Meta, StoryObj } from "@storybook/react-vite";
import { CanvasRenderer } from "../../components/catalog/canvas-renderer";

const meta = {
  title: "Catalog/Canvas/CanvasRenderer",
  component: CanvasRenderer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof CanvasRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectionMode: Story = {
  args: {
    payload: { type: "canvas_interaction", action: "selection", instruction: "Select a node to inspect" },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data),
  },
};

export const KanbanWidget: Story = {
  args: {
    payload: {
      type: "canvas_interaction",
      action: "render",
      componentType: "sofia-widget",
      props: {
        provider: "sofia",
        widgetId: "kanban",
        variant: "kanban",
        data: {
          columns: ["open", "in_progress", "closed"],
          cards: [
            { id: "T-1", title: "Fix login bug", column: "open", priority: "P1" },
            { id: "T-2", title: "Add dark mode", column: "in_progress", priority: "P2", owner: "alice" },
            { id: "T-3", title: "Deploy v2", column: "closed", priority: "P0" },
          ],
        },
      },
    },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data),
  },
};

export const InvalidPayload: Story = {
  args: {
    payload: { type: "canvas_interaction", action: "render", componentType: "sofia-widget", props: { provider: "sofia", widgetId: "unknown-widget" } },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data),
  },
};
