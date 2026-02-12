import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MultiSelect } from "../../components/migrations/multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Migrations/WebUI/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 260, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  args: {
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
      { value: "angular", label: "Angular" },
    ],
    selected: ["react"],
    placeholder: "Select frameworks...",
    onChange: () => {},
  },
};
