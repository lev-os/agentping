import type { Meta, StoryObj } from "@storybook/react-vite";
import { PropertiesPanel } from "../../components/migrations/properties-panel";

const meta = {
  title: "Migrations/Studio/PropertiesPanel",
  component: PropertiesPanel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 500, width: 300 }}><Story /></div>],
} satisfies Meta<typeof PropertiesPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedElementName: "Hero Frame",
    layoutProperties: [
      {
        id: "position",
        label: "Position",
        fields: [
          { key: "x", label: "X", value: 120, type: "number" },
          { key: "y", label: "Y", value: 80, type: "number" },
          { key: "width", label: "Width", value: 400, type: "number" },
          { key: "height", label: "Height", value: 300, type: "number" },
        ],
      },
      {
        id: "layout",
        label: "Auto Layout",
        fields: [
          { key: "direction", label: "Direction", value: "horizontal", type: "select", options: ["horizontal", "vertical"] },
          { key: "gap", label: "Gap", value: 16, type: "number" },
        ],
      },
    ],
    styleProperties: [
      {
        id: "fill",
        label: "Fill",
        fields: [
          { key: "bg", label: "Background", value: "#1a1a2e", type: "color" },
          { key: "opacity", label: "Opacity", value: 100, type: "number" },
        ],
      },
    ],
    onPropertyChange: () => {},
  },
};

export const NoSelection: Story = { args: {} };
