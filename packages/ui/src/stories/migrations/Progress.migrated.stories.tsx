// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "../../components/migrations/progress";

const meta: Meta<typeof Progress> = {
  title: "Migrations/WebUI/Sofia/Progress",
  component: Progress,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {},
};
