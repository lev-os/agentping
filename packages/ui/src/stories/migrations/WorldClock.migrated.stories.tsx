import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorldClock } from "../../components/migrations/world-clock";

const meta = {
  title: "Migrations/WebUI/Root/WorldClock",
  component: WorldClock,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof WorldClock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    timezones: [
      { zone: "America/New_York", label: "New York" },
      { zone: "Europe/London", label: "London" },
      { zone: "Europe/Berlin", label: "Berlin" },
      { zone: "Asia/Tokyo", label: "Tokyo" },
    ],
  },
};

export const Pacific: Story = {
  args: {
    timezones: [
      { zone: "America/Los_Angeles", label: "LA" },
      { zone: "Pacific/Auckland", label: "Auckland" },
      { zone: "Asia/Singapore", label: "Singapore" },
    ],
  },
};
