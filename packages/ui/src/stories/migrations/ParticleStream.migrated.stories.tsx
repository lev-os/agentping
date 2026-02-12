import type { Meta, StoryObj } from "@storybook/react";
import { ParticleStream } from "../../components/migrations/particle-stream";

const meta = {
  title: "Migrations/WebUI/Visuals/ParticleStream",
  component: ParticleStream,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ParticleStream>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 30,
    speed: 3,
    className: "w-[400px] h-[300px]",
  },
};
