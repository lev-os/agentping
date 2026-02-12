import type { Meta, StoryObj } from "@storybook/react";
import { TileCard } from "../../components/migrations/tile-card";

const meta: Meta<typeof TileCard> = {
  title: "Migrations/WebUI/Recipes/TileCard",
  component: TileCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TileCard>;

export const Default: Story = {
  args: {
    item: { title: "Agent Alpha", status: "active", score: 92, role: "Researcher" },
    config: {
      title: "title" as never,
      subtitle: "role" as never,
      badges: [{ field: "status" as never, variant: "outline" as const }],
      stats: [{ field: "score" as never, label: "Score" }],
      primaryAction: { label: "View", action: "view" },
    },
  },
};
