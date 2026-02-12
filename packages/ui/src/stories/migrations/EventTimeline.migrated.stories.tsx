import type { Meta, StoryObj } from "@storybook/react";
import { EventTimeline } from "../../components/migrations/event-timeline";

const meta = {
  title: "Migrations/WebUI/Logs/EventTimeline",
  component: EventTimeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EventTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
