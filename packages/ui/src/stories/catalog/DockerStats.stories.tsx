import type { Meta, StoryObj } from "@storybook/react-vite";
import { DockerStats } from "../../components/catalog/docker-stats";

const meta = {
  title: "Catalog/WebUI/Logs/DockerStats",
  component: DockerStats,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DockerStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
