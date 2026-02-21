// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { LcarsPanel } from "../../components/migrations/lcars-panel";

const meta = {
  title: "Migrations/WebUI/LCARS/LcarsPanel",
  component: LcarsPanel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LcarsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
