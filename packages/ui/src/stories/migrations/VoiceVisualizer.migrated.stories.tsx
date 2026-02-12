import type { Meta, StoryObj } from "@storybook/react";
import { VoiceVisualizer } from "../../components/migrations/voice-visualizer";

const meta = {
  title: "Migrations/WebUI/Visuals/VoiceVisualizer",
  component: VoiceVisualizer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof VoiceVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
