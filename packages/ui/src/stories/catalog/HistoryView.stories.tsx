import type { Meta, StoryObj } from "@storybook/react-vite";
import { HistoryView } from "../../components/catalog/history-view";

const meta: Meta<typeof HistoryView> = {
  title: "Catalog/WebUI/HistoryView",
  component: HistoryView,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HistoryView>;

export const Default: Story = {
  args: {},
};
