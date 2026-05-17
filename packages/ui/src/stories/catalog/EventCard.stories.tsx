import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventCard } from "../../components/catalog/event-card";

const meta: Meta<typeof EventCard> = {
  title: "Catalog/WebUI/EventCard",
  component: EventCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {},
};
