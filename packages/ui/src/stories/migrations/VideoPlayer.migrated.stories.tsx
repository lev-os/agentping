import type { Meta, StoryObj } from "@storybook/react";
import { VideoPlayer } from "../../components/migrations/video-player";

const meta = {
  title: "Migrations/WebUI/Root/VideoPlayer",
  component: VideoPlayer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-[480px]" },
};

export const NoSource: Story = {
  args: { className: "w-[480px]" },
};
