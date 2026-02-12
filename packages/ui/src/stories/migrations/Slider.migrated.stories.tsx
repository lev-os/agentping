import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../../components/migrations/slider";

const meta = {
  title: "Migrations/WebUI/Root/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { min: 0, max: 100, value: 50, label: "Volume" } };

export const WithStep: Story = { args: { min: 0, max: 1, step: 0.1, value: 0.5, label: "Opacity" } };
