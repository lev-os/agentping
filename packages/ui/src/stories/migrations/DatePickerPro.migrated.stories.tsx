import type { Meta, StoryObj } from "@storybook/react";
import { DatePickerPro } from "../../components/migrations/date-picker-pro";

const meta: Meta<typeof DatePickerPro> = {
  title: "Migrations/WebUI/DatePickerPro",
  component: DatePickerPro,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DatePickerPro>;

export const Default: Story = {
  args: {
    value: "2026-01-15",
    label: "Deadline",
    placeholder: "Select date...",
    onChange: () => {},
  },
};

export const WithTime: Story = {
  args: {
    value: "2026-01-15T14:30",
    label: "Meeting Time",
    showTime: true,
    onChange: () => {},
  },
};
