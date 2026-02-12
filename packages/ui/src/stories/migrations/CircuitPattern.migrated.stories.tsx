import type { Meta, StoryObj } from "@storybook/react";
import { CircuitPattern } from "../../components/migrations/circuit-pattern";

const meta = {
  title: "Migrations/WebUI/Visuals/CircuitPattern",
  component: CircuitPattern,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CircuitPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
