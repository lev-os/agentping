import type { Meta, StoryObj } from "@storybook/react";
import { RegexTester } from "../../components/migrations/regex-tester";

const meta = {
  title: "Migrations/WebUI/Root/RegexTester",
  component: RegexTester,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RegexTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
