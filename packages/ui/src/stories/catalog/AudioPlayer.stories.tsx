import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayer } from "../../components/catalog/audio-player";

const meta: Meta<typeof AudioPlayer> = {
  title: "Catalog/WebUI/AudioPlayer",
  component: AudioPlayer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AudioPlayer>;

export const Default: Story = {
  args: {},
};
