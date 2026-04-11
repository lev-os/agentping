import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimezoneSlider } from "../../components/migrations/timezone-slider";

const meta = {
  title: "Migrations/WebUI/Root/TimezoneSlider",
  component: TimezoneSlider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TimezoneSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    timezones: [
      "America/New_York",
      "Europe/London",
      "Asia/Kolkata",
      "Asia/Tokyo",
      "Australia/Sydney",
    ],
  },
};

export const USTimezones: Story = {
  args: {
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
    ],
  },
};
