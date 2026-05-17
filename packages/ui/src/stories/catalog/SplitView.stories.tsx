import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitView } from "../../components/catalog/split-view";

const meta = {
  title: "Catalog/WebUI/Root/SplitView",
  component: SplitView,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
