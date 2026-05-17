import type { Meta, StoryObj } from "@storybook/react-vite";
import { VoiceVisualizer } from "../../components/catalog/voice-visualizer";

const meta = {
  title: "Catalog/WebUI/Visuals/VoiceVisualizer",
  component: VoiceVisualizer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof VoiceVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
