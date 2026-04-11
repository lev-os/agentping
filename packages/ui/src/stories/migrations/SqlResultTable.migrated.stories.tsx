import type { Meta, StoryObj } from "@storybook/react-vite";
import { SqlResultTable } from "../../components/migrations/sql-result-table";

const meta = {
  title: "Migrations/WebUI/Data/SqlResultTable",
  component: SqlResultTable,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SqlResultTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
