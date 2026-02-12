import type { Meta, StoryObj } from "@storybook/react";
import { ArtifactBadge } from "../../components/migrations/artifact-badge";

const meta: Meta<typeof ArtifactBadge> = {
  title: "Migrations/WebUI/Dashboard/ArtifactBadge",
  component: ArtifactBadge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ArtifactBadge>;

export const Default: Story = {
  args: {
    id: "art-1",
    name: "@kingly/ui",
    type: "npm",
    version: "2.4.0",
    status: "available",
  },
};

export const Compact: Story = {
  args: { id: "art-2", name: "gateway", type: "docker", version: "latest", variant: "compact" },
};

export const Error: Story = {
  args: { id: "art-3", name: "build-artifact", status: "error" },
};
