import type { Meta, StoryObj } from "@storybook/react";
import { WeeklySchedule } from "../../components/migrations/weekly-schedule";

const meta = {
  title: "Migrations/WebUI/Root/WeeklySchedule",
  component: WeeklySchedule,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof WeeklySchedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: [
      { day: 0, startHour: 9, endHour: 10, title: "Standup" },
      { day: 0, startHour: 14, endHour: 16, title: "Design Review" },
      { day: 1, startHour: 10, endHour: 12, title: "Sprint Planning" },
      { day: 2, startHour: 9, endHour: 10, title: "Standup" },
      { day: 2, startHour: 13, endHour: 15, title: "Code Review" },
      { day: 3, startHour: 11, endHour: 12, title: "1:1 Meeting" },
      { day: 4, startHour: 9, endHour: 10, title: "Standup" },
      { day: 4, startHour: 15, endHour: 17, title: "Demo" },
    ],
    startHour: 8,
    endHour: 18,
  },
};

export const LightSchedule: Story = {
  args: {
    events: [
      { day: 1, startHour: 10, endHour: 11, title: "Check-in", color: "#8b5cf6" },
      { day: 3, startHour: 14, endHour: 15, title: "Review", color: "#f59e0b" },
    ],
    startHour: 9,
    endHour: 17,
  },
};
