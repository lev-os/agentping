import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrainActivity } from "../../components/catalog/brain-activity";

const meta: Meta<typeof BrainActivity> = {
  title: "Catalog/WebUI/BrainActivity",
  component: BrainActivity,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof BrainActivity>;

export const Default: Story = {
  args: {
    regions: [
      { name: "Reasoning", activity: 85 },
      { name: "Memory", activity: 62 },
      { name: "Planning", activity: 45 },
      { name: "Perception", activity: 90 },
      { name: "Language", activity: 73 },
    ],
  },
};
