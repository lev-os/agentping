import type { Meta, StoryObj } from "@storybook/react-vite";
import { HistoryView } from "../../components/migrations/history-view";

const meta: Meta<typeof HistoryView> = {
  title: "Migrations/WebUI/HistoryView",
  component: HistoryView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HistoryView>;

export const Default: Story = {
  args: {},
};
