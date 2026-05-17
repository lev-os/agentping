// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LcarsButton } from "../../components/catalog/lcars-button";

const meta = {
  title: "Catalog/WebUI/LCARS/LcarsButton",
  component: LcarsButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LcarsButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
