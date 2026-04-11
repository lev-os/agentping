import type { Meta, StoryObj } from "@storybook/react-vite";
import { TransferList } from "../../components/migrations/transfer-list";

const meta = {
  title: "Migrations/WebUI/Root/TransferList",
  component: TransferList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    available: [
      { id: "1", label: "React" },
      { id: "2", label: "Vue" },
      { id: "3", label: "Svelte" },
      { id: "4", label: "Angular" },
    ],
    selected: [
      { id: "5", label: "Next.js" },
      { id: "6", label: "Remix" },
    ],
  },
};

export const EmptySelected: Story = {
  args: {
    available: [
      { id: "1", label: "Option A" },
      { id: "2", label: "Option B" },
    ],
    selected: [],
  },
};
