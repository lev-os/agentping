import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterPanel } from "../../components/catalog/footer-panel";

const meta = {
  title: "Catalog/Studio/FooterPanel",
  component: FooterPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof FooterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: { isExpanded: false, onToggleExpand: () => {} },
};

export const Expanded: Story = {
  args: { isExpanded: true, activeTab: "shell", onToggleExpand: () => {} },
};

export const Default = Expanded;
