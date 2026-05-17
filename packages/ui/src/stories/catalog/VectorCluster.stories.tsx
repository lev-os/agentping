import type { Meta, StoryObj } from "@storybook/react-vite";
import { VectorCluster } from "../../components/catalog/vector-cluster";

const meta = {
  title: "Catalog/WebUI/Root/VectorCluster",
  component: VectorCluster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof VectorCluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    points: [
      { x: 1, y: 2, label: "auth.ts", cluster: 0 },
      { x: 1.5, y: 2.3, label: "login.ts", cluster: 0 },
      { x: 5, y: 6, label: "dashboard.tsx", cluster: 1 },
      { x: 5.5, y: 5.8, label: "chart.tsx", cluster: 1 },
      { x: 5.2, y: 6.5, label: "table.tsx", cluster: 1 },
      { x: 9, y: 1, label: "test.spec.ts", cluster: 2 },
      { x: 9.3, y: 1.5, label: "fixture.ts", cluster: 2 },
      { x: 3, y: 8, label: "utils.ts", cluster: 3 },
    ],
    width: 400,
    height: 300,
  },
};

export const Empty: Story = {
  args: { points: [], width: 400, height: 200 },
};
