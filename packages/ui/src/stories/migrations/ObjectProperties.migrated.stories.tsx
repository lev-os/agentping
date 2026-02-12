import type { Meta, StoryObj } from "@storybook/react";
import { ObjectProperties } from "../../components/migrations/object-properties";

const meta = {
  title: "Migrations/WebUI/Data/ObjectProperties",
  component: ObjectProperties,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ObjectProperties>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Agent Config",
    properties: [
      { name: "model", value: "claude-opus-4-6", type: "string" },
      { name: "temperature", value: 0.7, type: "number", editable: true },
      { name: "streaming", value: true, type: "boolean" },
      { name: "max_tokens", value: 4096, type: "number" },
    ],
  },
};
