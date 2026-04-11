import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectionList } from "../../components/migrations/selection-list";

const meta = {
  title: "Migrations/WebUI/Root/SelectionList",
  component: SelectionList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SelectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: "1", label: "TypeScript", selected: true },
      { id: "2", label: "Python", selected: false },
      { id: "3", label: "Rust", selected: true },
      { id: "4", label: "Go", selected: false },
    ],
    selectAll: true,
  },
};

export const Empty: Story = {
  args: { items: [] },
};
