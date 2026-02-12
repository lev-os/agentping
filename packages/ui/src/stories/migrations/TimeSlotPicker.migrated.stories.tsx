import type { Meta, StoryObj } from "@storybook/react";
import { TimeSlotPicker } from "../../components/migrations/time-slot-picker";

const meta = {
  title: "Migrations/WebUI/Root/TimeSlotPicker",
  component: TimeSlotPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TimeSlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    slots: [
      { time: "09:00", available: true },
      { time: "09:30", available: true },
      { time: "10:00", available: false },
      { time: "10:30", available: false },
      { time: "11:00", available: true },
      { time: "11:30", available: true },
      { time: "12:00", available: false },
      { time: "12:30", available: false },
      { time: "13:00", available: true },
      { time: "13:30", available: true },
      { time: "14:00", available: true },
      { time: "14:30", available: false },
      { time: "15:00", available: true },
      { time: "15:30", available: true },
      { time: "16:00", available: true },
      { time: "16:30", available: false },
    ],
    selected: ["09:00", "13:00"],
    columns: 4,
  },
};

export const NarrowGrid: Story = {
  args: {
    slots: [
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "12:00", available: false },
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
    ],
    selected: ["11:00"],
    columns: 3,
  },
};
