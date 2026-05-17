import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogHistogram } from "../../components/catalog/log-histogram";

const meta: Meta<typeof LogHistogram> = {
  title: "Catalog/WebUI/LogHistogram",
  component: LogHistogram,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LogHistogram>;

export const Default: Story = {
  args: {
    data: [
      { time: "09:00", count: 5, level: "info" },
      { time: "09:05", count: 12, level: "info" },
      { time: "09:10", count: 3, level: "warn" },
      { time: "09:15", count: 18, level: "error" },
      { time: "09:20", count: 7, level: "info" },
      { time: "09:25", count: 2, level: "info" },
    ],
  },
};
