import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider } from "../../components/migrations/range-slider";

const meta = {
  title: "Migrations/WebUI/Root/RangeSlider",
  component: RangeSlider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
