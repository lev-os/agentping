import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegexTester } from "../../components/catalog/regex-tester";

const meta = {
  title: "Catalog/WebUI/Root/RegexTester",
  component: RegexTester,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RegexTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
