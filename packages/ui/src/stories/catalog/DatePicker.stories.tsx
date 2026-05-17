import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "../../components/catalog/date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Catalog/WebUI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    value: "2026-01-15",
    label: "Start Date",
    placeholder: "Select date...",
    onChange: () => {},
  },
};
