import type { Meta, StoryObj } from "@storybook/react";
import { Layers } from "../../components/migrations/layers";

const meta = {
  title: "Migrations/Studio/Layers",
  component: Layers,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 400, width: 260 }}><Story /></div>],
} satisfies Meta<typeof Layers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canvasObjects: [
      { id: "1", name: "Header Frame", type: "frame", visible: true, locked: false },
      { id: "2", name: "Hero Image", type: "image", visible: true, locked: false },
      { id: "3", name: "Title Text", type: "text", visible: true, locked: true },
      { id: "4", name: "Button", type: "rectangle", visible: false, locked: false },
      { id: "5", name: "Card Group", type: "group", visible: true, locked: false, children: [
        { id: "5a", name: "Card BG", type: "rectangle", visible: true, locked: false },
        { id: "5b", name: "Card Title", type: "text", visible: true, locked: false },
      ]},
    ],
    selectedLayerId: "3",
    onSelectLayer: () => {},
    onToggleVisibility: () => {},
    onToggleLock: () => {},
    onDeleteLayer: () => {},
  },
};

export const Empty: Story = { args: { canvasObjects: [] } };
