import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircularProgress } from "../../components/catalog/circular-progress";

const meta: Meta<typeof CircularProgress> = {
  title: "Catalog/WebUI/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: { value: 65 },
};

export const Complete: Story = {
  args: { value: 100, label: "Done" },
};

export const Small: Story = {
  args: { value: 30, size: 40, strokeWidth: 3 },
};
