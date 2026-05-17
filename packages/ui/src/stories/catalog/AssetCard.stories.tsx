import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssetCard } from "../../components/catalog/asset-card";

const meta = {
  title: "Catalog/WebUI/Finance/AssetCard",
  component: AssetCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
