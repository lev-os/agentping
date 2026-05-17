import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileMetadataCard } from "../../components/catalog/file-metadata-card";

const meta: Meta<typeof FileMetadataCard> = {
  title: "Catalog/WebUI/FileMetadataCard",
  component: FileMetadataCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileMetadataCard>;

export const Default: Story = {
  args: {
    file: {
      name: "config.yaml",
      size: "4.2 KB",
      type: "text/yaml",
      modified: "2026-02-10T14:30:00Z",
      path: "/etc/agentping/config.yaml",
    },
  },
};
