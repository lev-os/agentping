import type { Meta, StoryObj } from "@storybook/react";
import { KeyValueStore } from "../../components/migrations/key-value-store";

const meta = {
  title: "Migrations/WebUI/Data/KeyValueStore",
  component: KeyValueStore,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof KeyValueStore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
