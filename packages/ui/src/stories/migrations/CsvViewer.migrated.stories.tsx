import type { Meta, StoryObj } from "@storybook/react";
import { CsvViewer } from "../../components/migrations/csv-viewer";

const meta: Meta<typeof CsvViewer> = {
  title: "Migrations/WebUI/CsvViewer",
  component: CsvViewer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CsvViewer>;

export const Default: Story = {
  args: {
    data: [
      ["Name", "Status", "Uptime"],
      ["agent-01", "online", "4h 23m"],
      ["agent-02", "offline", "0m"],
      ["agent-03", "online", "12h 5m"],
    ],
    hasHeader: true,
  },
};
