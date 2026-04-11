import type { Meta, StoryObj } from "@storybook/react-vite";
import { TileCard } from "../../components/recipes/crud/views/TileCard";

const meta: Meta<typeof TileCard> = {
  title: "Migrations/Canonical/Recipes/TileCard",
  component: TileCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TileCard>;

export const Default: Story = {
  args: {
    item: { id: "1", name: "Agent Alpha", status: "active" },
    config: {
      title: "name" as const,
      subtitle: "status" as const,
    },
  },
};

export const WithAvatar: Story = {
  args: {
    item: { id: "2", name: "Agent Beta", status: "idle" },
    config: {
      title: "name" as const,
      subtitle: "status" as const,
      avatar: { field: "name" as const, type: "initials" as const },
    },
  },
};

export const WithBadges: Story = {
  args: {
    item: { id: "3", name: "Agent Gamma", status: "error", role: "worker" },
    config: {
      title: "name" as const,
      subtitle: "status" as const,
      badges: [{ field: "role" as const, variant: "outline" as const }],
    },
  },
};
