import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyValueStore } from "../../components/catalog/key-value-store";

const meta = {
  title: "Catalog/WebUI/Data/KeyValueStore",
  component: KeyValueStore,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof KeyValueStore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
