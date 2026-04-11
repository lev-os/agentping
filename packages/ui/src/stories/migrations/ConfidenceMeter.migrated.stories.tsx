import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfidenceMeter } from "../../components/migrations/confidence-meter";

const meta: Meta<typeof ConfidenceMeter> = {
  title: "Migrations/WebUI/ConfidenceMeter",
  component: ConfidenceMeter,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConfidenceMeter>;

export const Default: Story = {
  args: { value: 87 },
};

export const Low: Story = {
  args: { value: 25, label: "Match Score" },
};
