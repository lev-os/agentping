import type { Meta, StoryObj } from "@storybook/react";
import { DockerStats } from "../../components/migrations/docker-stats";

const meta = {
  title: "Migrations/WebUI/Logs/DockerStats",
  component: DockerStats,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DockerStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
