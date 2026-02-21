// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { LcarsButton } from "../../components/migrations/lcars-button";

const meta = {
  title: "Migrations/WebUI/LCARS/LcarsButton",
  component: LcarsButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LcarsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
