import type { Meta, StoryObj } from "@storybook/react";
import { AudioPlayer } from "../../components/migrations/audio-player";

const meta: Meta<typeof AudioPlayer> = {
  title: "Migrations/WebUI/AudioPlayer",
  component: AudioPlayer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AudioPlayer>;

export const Default: Story = {
  args: {},
};
