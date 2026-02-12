import type { Meta, StoryObj } from "@storybook/react";
import { EventCard } from "../../components/migrations/event-card";

const meta: Meta<typeof EventCard> = {
  title: "Migrations/WebUI/EventCard",
  component: EventCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {},
};
