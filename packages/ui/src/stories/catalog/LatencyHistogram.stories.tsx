import type { Meta, StoryObj } from "@storybook/react-vite";
import { LatencyHistogram } from "../../components/catalog/latency-histogram";

const meta: Meta<typeof LatencyHistogram> = {
  title: "Catalog/WebUI/LatencyHistogram",
  component: LatencyHistogram,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LatencyHistogram>;

export const Default: Story = {
  args: {
    data: [
      { label: "0-50ms", count: 120 },
      { label: "50-100ms", count: 85 },
      { label: "100-200ms", count: 45 },
      { label: "200-500ms", count: 20 },
      { label: "500ms+", count: 5 },
    ],
    height: 200,
  },
};
