import type { Meta, StoryObj } from "@storybook/react";
import { LcarsElbow } from "../../components/migrations/lcars-elbow";

const meta = {
  title: "Migrations/WebUI/LCARS/LcarsElbow",
  component: LcarsElbow,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LcarsElbow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: "top-left",
    size: "md",
    color: "tan",
  },
};
