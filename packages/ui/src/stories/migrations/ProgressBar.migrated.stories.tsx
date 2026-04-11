import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "../../components/migrations/progress-bar";

const meta = {
  title: "Migrations/WebUI/Root/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
