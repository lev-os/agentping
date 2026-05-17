import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogSearchQuery } from "../../components/catalog/log-search-query";

const meta = {
  title: "Catalog/WebUI/Logs/LogSearchQuery",
  component: LogSearchQuery,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LogSearchQuery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
