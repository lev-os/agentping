import type { Meta, StoryObj } from "@storybook/react-vite";
import { DailyAgenda } from "../../components/catalog/daily-agenda";

const meta: Meta<typeof DailyAgenda> = {
  title: "Catalog/WebUI/DailyAgenda",
  component: DailyAgenda,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DailyAgenda>;

export const Default: Story = {
  args: {
    date: "2026-02-12",
    items: [
      { id: "1", time: "09:00", title: "Standup", type: "meeting" },
      { id: "2", time: "11:00", title: "Deploy v2.3", description: "Production rollout", type: "task" },
      { id: "3", time: "14:00", title: "Review PR #42", type: "task" },
    ],
  },
};
