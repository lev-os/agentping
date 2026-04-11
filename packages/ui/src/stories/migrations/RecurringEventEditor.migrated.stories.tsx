import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecurringEventEditor } from "../../components/migrations/recurring-event-editor";

const meta = {
  title: "Migrations/WebUI/Root/RecurringEventEditor",
  component: RecurringEventEditor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RecurringEventEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
