import type { Meta, StoryObj } from "@storybook/react-vite";
import { VoiceConsole } from "../../components/migrations/voice-console";

const meta = {
  title: "Migrations/Studio/VoiceConsole",
  component: VoiceConsole,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof VoiceConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { isOpen: true, onToggle: () => {}, onCommand: () => {} },
};

export const Listening: Story = {
  args: {
    isOpen: true,
    onToggle: () => {},
    isListening: true,
    transcript: "Run the test suite",
  },
};

export const WithResponse: Story = {
  args: {
    isOpen: true,
    onToggle: () => {},
    transcript: "Show git status",
    response: "Running git status in /Users/dev/project...",
  },
};
