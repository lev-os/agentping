import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { MultiSelect } from "../../components/migrations/multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Migrations/WebUI/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    options: { control: "object" },
    selected: { control: "object" },
    placeholder: { control: "text" },
    onChange: { table: { disable: true } },
  },
  decorators: [
    (Story, context) => {
      const [selected, setSelected] = React.useState<string[]>(
        context.args.selected || [],
      );
      return (
        <div style={{ minHeight: 260, padding: 16 }}>
          <MultiSelect {...context.args} selected={selected} onChange={setSelected} />
        </div>
      );
    },
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
  },
};
