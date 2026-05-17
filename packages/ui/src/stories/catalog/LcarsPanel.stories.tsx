// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LcarsPanel } from "../../components/catalog/lcars-panel";

const meta = {
  title: "Catalog/WebUI/LCARS/LcarsPanel",
  component: LcarsPanel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LcarsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
