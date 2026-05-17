import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventTimeline } from "../../components/catalog/event-timeline";

const meta = {
  title: "Catalog/WebUI/Logs/EventTimeline",
  component: EventTimeline,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EventTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
