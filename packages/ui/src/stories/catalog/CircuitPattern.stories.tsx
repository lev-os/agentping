import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircuitPattern } from "../../components/catalog/circuit-pattern";

const meta = {
  title: "Catalog/WebUI/Visuals/CircuitPattern",
  component: CircuitPattern,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CircuitPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
