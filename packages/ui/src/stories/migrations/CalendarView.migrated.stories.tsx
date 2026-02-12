import type { Meta, StoryObj } from "@storybook/react";
import { CalendarView } from "../../components/migrations/calendar-view";

const meta: Meta<typeof CalendarView> = {
  title: "Migrations/WebUI/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CalendarView>;

export const Default: Story = {
  args: {},
};
