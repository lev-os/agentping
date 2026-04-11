import type { Meta, StoryObj } from "@storybook/react-vite";
import { SankeyDiagram } from "../../components/migrations/sankey-diagram";

const meta = {
  title: "Migrations/WebUI/Root/SankeyDiagram",
  component: SankeyDiagram,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SankeyDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nodes: [
      { id: "src1", label: "API Calls", column: 0 },
      { id: "src2", label: "Webhooks", column: 0 },
      { id: "mid1", label: "Auth", column: 1 },
      { id: "mid2", label: "Router", column: 1 },
      { id: "dst1", label: "Database", column: 2 },
      { id: "dst2", label: "Cache", column: 2 },
      { id: "dst3", label: "Queue", column: 2 },
    ],
    links: [
      { source: "src1", target: "mid1", value: 40 },
      { source: "src1", target: "mid2", value: 60 },
      { source: "src2", target: "mid2", value: 30 },
      { source: "mid1", target: "dst1", value: 35 },
      { source: "mid1", target: "dst2", value: 5 },
      { source: "mid2", target: "dst1", value: 20 },
      { source: "mid2", target: "dst2", value: 30 },
      { source: "mid2", target: "dst3", value: 40 },
    ],
    width: 600,
    height: 350,
  },
};

export const SimpleFlow: Story = {
  args: {
    nodes: [
      { id: "a", label: "Input", column: 0 },
      { id: "b", label: "Process", column: 1 },
      { id: "c", label: "Output", column: 2 },
    ],
    links: [
      { source: "a", target: "b", value: 100 },
      { source: "b", target: "c", value: 100 },
    ],
    width: 400,
    height: 200,
  },
};
