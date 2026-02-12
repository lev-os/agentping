import type { Meta, StoryObj } from "@storybook/react";
import { LogSearchQuery } from "../../components/migrations/log-search-query";

const meta = {
  title: "Migrations/WebUI/Logs/LogSearchQuery",
  component: LogSearchQuery,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LogSearchQuery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
