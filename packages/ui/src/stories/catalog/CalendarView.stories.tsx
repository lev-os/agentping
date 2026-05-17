import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarView } from "../../components/catalog/calendar-view";

const meta: Meta<typeof CalendarView> = {
  title: "Catalog/WebUI/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CalendarView>;

export const Default: Story = {
  args: {},
};
