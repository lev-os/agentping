import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "../../components/catalog/segmented-control";

const meta = {
  title: "Catalog/WebUI/Root/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { options: ["Day", "Week", "Month", "Year"], selected: "Week" },
};

export const TwoOptions: Story = {
  args: { options: ["Grid", "List"], selected: "Grid" },
};
